import { Link } from '@inertiajs/react';

const PostLink = ({href, data = {}, className = '', child = null, text = ''}) =>
        (<Link method='post' as='button' href={href} data={data} className={className}>{child || new String(text)}</Link>);

export default PostLink;
