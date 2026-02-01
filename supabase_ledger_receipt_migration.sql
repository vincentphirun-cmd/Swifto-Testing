-- Extend financial_ledger as receipt source
-- Each ledger row can be presented as a tax receipt / invoice

ALTER TABLE financial_ledger ADD COLUMN IF NOT EXISTS receipt_type TEXT
  CHECK (receipt_type IN ('job_payment','listing_fee','student_payout','lister_refund'));

ALTER TABLE financial_ledger ADD COLUMN IF NOT EXISTS receipt_number TEXT UNIQUE;

-- Generate receipt_number from id for existing rows, then add trigger for new rows
UPDATE financial_ledger
SET receipt_number = 'SWF-' || UPPER(SUBSTRING(REPLACE(id::text, '-', ''), 1, 12)),
    receipt_type = CASE
      WHEN notes = 'Listing fee' THEN 'listing_fee'
      WHEN net_payout_to_student > 0 THEN 'student_payout'
      ELSE 'job_payment'
    END
WHERE receipt_number IS NULL OR receipt_type IS NULL;

CREATE OR REPLACE FUNCTION set_ledger_receipt_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.receipt_number IS NULL THEN
    NEW.receipt_number := 'SWF-' || UPPER(SUBSTRING(REPLACE(NEW.id::text, '-', ''), 1, 12));
  END IF;
  IF NEW.receipt_type IS NULL THEN
    IF NEW.notes = 'Listing fee' THEN
      NEW.receipt_type := 'listing_fee';
    ELSIF NEW.net_payout_to_student > 0 THEN
      NEW.receipt_type := 'student_payout';
    ELSIF NEW.job_price_gross > 0 THEN
      NEW.receipt_type := 'job_payment';
    ELSE
      NEW.receipt_type := 'job_payment';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_ledger_receipt ON financial_ledger;
CREATE TRIGGER trigger_ledger_receipt
  BEFORE INSERT ON financial_ledger
  FOR EACH ROW
  EXECUTE FUNCTION set_ledger_receipt_number();

-- Ensure receipt_number unique (add suffix if collision)
CREATE UNIQUE INDEX IF NOT EXISTS idx_financial_ledger_receipt_number ON financial_ledger(receipt_number);
