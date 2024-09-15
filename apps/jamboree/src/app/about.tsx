import { JAMBOREE_URL, SOURCE_CODE_URL } from '@parsers-jamboree/common';

export const About = () => {
  return (
    <div>
      <h1>About</h1>
      <p>This application is the software behind <a href={JAMBOREE_URL}>my blog post about TypeScript validator libraries</a>.</p>
      <p>I figured out it would be more useful to have a single page without the blog fluff and opinions.</p>
      <p>This application is open source and available on <a href={SOURCE_CODE_URL}>{SOURCE_CODE_URL}</a>.</p>
    </div>
  )
}
