import { motion } from 'framer-motion'
import useTheme from '../../hooks/useTheme'
import instaLight from '../../assets/entypo-social--instagram-with-circle.svg'
import instaDark from '../../assets/entypo-social--instagram-with-circle--dark.svg'
import twitterLight from '../../assets/entypo-social--twitter-with-circle.svg'
import twitterDark from '../../assets/entypo-social--twitter-with-circle--dark.svg'
import githubLight from '../../assets/entypo-social--github-with-circle.svg'
import githubDark from '../../assets/entypo-social--github-with-circle--dark.svg'
import facebookLight from '../../assets/entypo-social--facebook-with-circle.svg'
import facebookDark from '../../assets/entypo-social--facebook-with-circle--dark.svg'
import youtubeLight from '../../assets/entypo-social--youtube-with-circle.svg'
import youtubeDark from '../../assets/entypo-social--youtube-with-circle--dark.svg'
import './SocialCloud.css'

export function SocialCloud({ className = '' }) {
  const theme = useTheme()
  const isDark = theme === 'dark'

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      iconSrc: isDark ? instaDark : instaLight,
    },
    {
      name: 'Twitter',
      url: 'https://x.com',
      iconSrc: isDark ? twitterDark : twitterLight,
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
      iconSrc: isDark ? githubDark : githubLight,
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      iconSrc: isDark ? facebookDark : facebookLight,
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      iconSrc: isDark ? youtubeDark : youtubeLight,
    },
  ]

  return (
    <div className={`social-cloud-container ${className}`}>
      {socialLinks.map((item) => (
        <motion.a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.name}
          className="social-cloud-btn"
          whileTap={{ scale: 0.93 }}
        >
          <img src={item.iconSrc} alt={item.name} className="social-cloud-icon-img" />
        </motion.a>
      ))}
    </div>
  )
}
