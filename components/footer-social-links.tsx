import { SITE_SOCIAL_LINKS } from '@/lib/site-social'
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from '@/components/social-icons'

const ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  x: XIcon,
  linkedin: LinkedInIcon,
}

export function FooterSocialLinks() {
  return (
    <div className="flex items-center gap-1.5">
      {SITE_SOCIAL_LINKS.map((item) => {
        const Icon = ICONS[item.icon]
        return (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.name}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
          >
            <Icon />
          </a>
        )
      })}
    </div>
  )
}
