import Container from "@/components/Container"
import Footer from "@/components/Footer"
import NavBar from "@/components/NavBar"

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavBar />
      <Container id="blog-layout" width="xl" className="mt-24">
        {children}
      </Container>
      <Footer />
    </>
  )
}

export default BlogLayout
