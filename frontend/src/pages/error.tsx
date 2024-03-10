import PageLayout from "../layouts/page/page"
import { Link } from "react-router-dom"

export default function ErrorPage() {
  return <PageLayout>
    <h1 className="center" style={{marginTop: '5rem'}}>Hey!!! are you lost?</h1>
    <h3 className="center" style={{marginTop: '5rem', textDecoration: 'underline'}}><Link to="/">Come on and meet the R&M crew!</Link></h3>
  </PageLayout>
}