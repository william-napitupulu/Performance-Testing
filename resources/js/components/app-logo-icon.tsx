import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img {...props} src="/images/PLN-icon.png" alt="PLN Logo" className={`object-contain ${props.className || ''}`} />;
}
