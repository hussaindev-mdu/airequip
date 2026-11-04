import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'

export default function NotFound() {
  return (
    <PageHero eyebrow="404" title="That page can’t be found." text="The link may be old or mistyped.">
      <Link to="/" className="btn btn-primary mt-7">Back to home</Link>
    </PageHero>
  )
}
