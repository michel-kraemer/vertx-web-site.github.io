import ScrollTopWorkaround from "@/components/ScrollTopWorkaround"
import { Chapter, isExternal, makeIndex, makeToc } from "@/components/docs/Toc"
import { versionFromSlug } from "@/components/docs/versionFromSlug"
import { versions as docsVersions, latestRelease } from "@/docs/metadata/all"
import { filterLatestBugfixVersions } from "@/docs/metadata/helpers"
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr"
import { Metadata, ResolvingMetadata } from "next"
import Link from "next/link"

interface DocsPageProps {
  params: { slug: string[] }
}

export async function generateMetadata(
  { params }: DocsPageProps,
  _: ResolvingMetadata,
): Promise<Metadata> {
  let fullSlug = undefined
  if (params.slug !== undefined) {
    fullSlug = params.slug.join("/")
  } else {
    fullSlug = ""
  }

  let { version, slug } = versionFromSlug(fullSlug)

  let toc = makeToc(version ?? latestRelease.version)
  let index = makeIndex(toc)

  let entry = index[slug]

  return {
    title: entry.title,
  }
}

function findNeighbors(
  slug: string,
  toc: Chapter[],
): [string | undefined, string | undefined] {
  let last: string | undefined
  let prev: string | undefined
  let hasPrev = false
  for (let c of toc) {
    for (let p of c.pages) {
      if (hasPrev) {
        return [prev, p.slug]
      }
      if (p.slug === slug) {
        hasPrev = true
        prev = last
      }
      last = p.slug
    }
  }
  return [prev, undefined]
}

export async function generateStaticParams() {
  let params = []

  let filteredVersions = filterLatestBugfixVersions(docsVersions)
  for (let version of filteredVersions) {
    // version index page
    params.push({
      slug: [version],
    })

    let toc = makeToc(version)
    for (let chapter of toc) {
      for (let page of chapter.pages) {
        if (isExternal(page.slug)) {
          // don't generate pages for external modules
          continue
        }

        let slug = page.slug.split("/")
        params.push({ slug: [version, ...slug] })

        // generate pages for latest version too
        if (latestRelease.version === version) {
          params.push({ slug })
        }
      }
    }
  }

  // add index page
  params.push({ slug: [] })

  return params
}

const DocsPage = ({ params }: DocsPageProps) => {
  let fullSlug = undefined
  if (params.slug !== undefined) {
    fullSlug = params.slug.join("/")
  } else {
    fullSlug = ""
  }

  let { version, slug } = versionFromSlug(fullSlug)
  let activeVersion = version ?? latestRelease.version

  let toc = makeToc(activeVersion)
  let index = makeIndex(toc)

  let entry = index[slug]

  let moduleFilename = slug
  if (moduleFilename === "") {
    moduleFilename = "get-started"
  }
  let data = require(
    `../../../docs/compiled/${slug === "" ? activeVersion : `${activeVersion}/${slug}`}/index.json`,
  )
  let Content = () => (
    <div
      dangerouslySetInnerHTML={{
        __html: data.contents,
      }}
    ></div>
  )

  let parentChapter = undefined
  if (entry.type === "page") {
    parentChapter = index[entry.chapter]
  }

  let [prev, next] = findNeighbors(slug, toc)

  let Main = (
    <>
      {parentChapter !== undefined ? (
        <div className="text-sm font-normal text-primary">
          {parentChapter.title}
        </div>
      ) : undefined}
      <div className="mt-2" id={slug}></div>
      <Content />
      <div className="not-prose mb-8 mt-14 flex justify-between gap-4 text-sm">
        <div>
          {prev !== undefined ? (
            <Link
              href={`/docs/${prev}`}
              className="group flex gap-1 font-normal text-gray-800 hover:text-primary"
            >
              <div className="text-gray-500 group-hover:text-primary">
                <CaretLeft size="1em" />
              </div>
              <div>{index[prev].title}</div>
            </Link>
          ) : undefined}
        </div>
        <div>
          {next !== undefined ? (
            <Link
              href={`/docs/${next}`}
              className="group flex gap-1 text-right font-normal text-gray-800 hover:text-primary"
            >
              <div>{index[next].title}</div>
              <div className="text-gray-500 group-hover:text-primary">
                <CaretRight size="1em" />
              </div>
            </Link>
          ) : undefined}
        </div>
      </div>
    </>
  )

  return (
    <>
      <ScrollTopWorkaround />
      <main className="prose mt-40 lg:mt-24 [&_.admonitionblock.warning]:border-alert [&_.admonitionblock]:my-4 [&_.admonitionblock]:border-l-8 [&_.admonitionblock]:border-primary [&_.admonitionblock]:bg-gray-100 [&_.admonitionblock]:px-4 [&_.admonitionblock]:py-3 [&_.admonitionblock_.title]:font-medium [&_.admonitionblock_p+p]:mt-2 [&_.admonitionblock_p:first-child]:mt-0 [&_.admonitionblock_p]:mb-0 [&_.admonitionblock_table]:m-0 [&_.admonitionblock_td]:p-0 [&_.admonitionblock_tr]:flex [&_.admonitionblock_tr]:flex-col [&_.listingblock+.listingblock]:mt-4 [&_.listingblock]:flex [&_.listingblock]:flex-col [&_.listingblock]:overflow-auto [&_.listingblock]:rounded-sm [&_.listingblock_.content]:flex [&_.listingblock_.content]:flex-1 [&_.listingblock_.content_pre]:flex-1 [&_.listingblock_.title]:font-normal [&_.literalblock]:flex [&_.literalblock]:overflow-auto [&_.literalblock]:rounded-sm [&_.literalblock_.content]:flex [&_.literalblock_.content]:flex-1 [&_.literalblock_.content_pre]:flex-1 [&_code]:leading-[1.6] [&_pre:not(:has(code))]:px-3 [&_pre:not(:has(code))]:py-3 [&_pre:not(:has(code))]:text-white">
        {Main}
      </main>
    </>
  )
}

export default DocsPage