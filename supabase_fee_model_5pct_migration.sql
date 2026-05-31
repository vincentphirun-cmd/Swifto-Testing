-- Swifto fee model: processing allocation $0.99 + 5% Swifto fee on remainder.
-- Listing $0.99 is charged at post; student payout = price - 0.99 - 5%*(price - 0.99).
-- Example: $30 job → student receives $27.56.

CREATE OR REPLACE FUNCTION get_swifto_service_fee_nzd(price_nzd NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  remainder NUMERIC;
BEGIN
  IF price_nzd <= 0 THEN
    RETURN 0;
  END IF;
  remainder := price_nzd - 0.99;
  IF remainder <= 0 THEN
    RETURN 0;
  END IF;
  RETURN ROUND((remainder * 0.05)::numeric, 2);
END;
$$;

CREATE OR REPLACE FUNCTION get_platform_fee_nzd(price_nzd NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF price_nzd <= 0 THEN
    RETURN 0;
  END IF;
  RETURN ROUND((0.99 + get_swifto_service_fee_nzd(price_nzd))::numeric, 2);
END;
$$;
