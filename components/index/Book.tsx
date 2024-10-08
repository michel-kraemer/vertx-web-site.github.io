import Button from "../Button"
import Container from "../Container"
import { useAnimate } from "framer-motion"
import { useEffect, useRef } from "react"

const URL = "https://www.manning.com/books/vertx-in-action"
const DISPLAY_SECONDS = 7
const TRANSITION_DURATION = 0.2

const Book = () => {
  const quote1 = useRef<HTMLDivElement>(null)
  const quote2 = useRef<HTMLDivElement>(null)
  const quote3 = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [scope, animate] = useAnimate()

  useEffect(() => {
    let duration = TRANSITION_DURATION
    let quotes = [quote1, quote2, quote3]
    let start: DOMHighResTimeStamp | undefined = undefined
    let seq: any[] = []
    let nextSeq = 0
    let done = false

    // Framer Motion's animate() with a sequence seems to have a bug: after
    // page transition, there's still something running in the background (CPU
    // usage is still at 5% on my machine). We run our own animation loop here
    // so we can use the standard animate() functionality, which does not have
    // this bug.

    function doAnimate(time: DOMHighResTimeStamp) {
      if (done) {
        return
      }

      if (start === undefined) {
        start = time
      }
      let elapsed = time - start

      while (elapsed >= seq[nextSeq][2].at * 1000) {
        animate(seq[nextSeq][0], seq[nextSeq][1], seq[nextSeq][2])

        nextSeq = (nextSeq + 1) % seq.length
        if (nextSeq === 0) {
          start += seq[seq.length - 1][2].at * 1000
          break
        }
      }

      if (!done) {
        requestAnimationFrame(doAnimate)
      }
    }

    requestAnimationFrame(doAnimate)

    for (let i = 0; i < quotes.length + 1; ++i) {
      if (i > 0) {
        seq.push([
          quotes[i % quotes.length].current,
          { opacity: 1 },
          { at: DISPLAY_SECONDS * i, duration },
        ])
      }
      if (i < quotes.length) {
        seq.push([
          quotes[i % quotes.length].current,
          { opacity: 0 },
          { at: DISPLAY_SECONDS * (i + 1), duration },
        ])
      }
    }

    animate(
      bar.current!!,
      { width: "100%" },
      {
        duration: DISPLAY_SECONDS,
        ease: "linear",
        repeat: Infinity,
      },
    )

    return () => {
      done = true
    }
  }, [animate])

  return (
    <section ref={scope}>
      <Container width="md">
        <div className="prose">
          <h3 className="text-center text-3xl">Read about Vert.x</h3>
          <p className="lead text-center">
            <em>Vert.x in Action</em> teaches you how to build responsive,
            resilient, and scalable JVM applications using well-established
            reactive design patterns.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-10 sm:flex-row">
          <div className="flex items-start justify-center sm:w-96">
            <a href={URL} target="_blank" rel="noopener noreferrer">
              <img
                src={require("../../assets/book-cover.jpg")}
                width="400"
                height="502"
                alt="Vert.x in Action book cover"
                className="max-w-44 rounded-sm border border-gray-200"
              />
            </a>
          </div>

          <div className="flex flex-col items-center justify-between gap-6 sm:items-start">
            <div className="relative border-l-8 border-gray-300 bg-gray-100 px-8 py-5">
              <div className="relative">
                <div ref={quote1}>
                  <div className="quote-content">
                    &ldquo;Fantastic introduction into Vert.x written for
                    developers looking to develop services more efficiently in
                    terms of time and resources.&rdquo;
                  </div>
                  <div className="text-right before:mr-2 before:tracking-[-.1em] before:content-['——_']">
                    Andrew Buttery
                  </div>
                </div>

                <div className="absolute inset-0 opacity-0" ref={quote2}>
                  <div className="quote-content">
                    &ldquo;A great book to add to your personal library of books
                    that discuss the major architectural challenges of writing
                    messaging frameworks.&rdquo;
                  </div>
                  <div className="text-right before:mr-2 before:tracking-[-.1em] before:content-['——_']">
                    Earl B. Bingham
                  </div>
                </div>

                <div className="absolute inset-0 opacity-0" ref={quote3}>
                  <div className="quote-content">
                    &ldquo;Provides not only an excellent introduction to
                    Vert.x, but reactive programming with Java in
                    general.&rdquo;
                  </div>
                  <div className="text-right before:mr-2 before:tracking-[-.1em] before:content-['——_']">
                    Damian Esteban
                  </div>
                </div>
              </div>

              <div
                ref={bar}
                className="absolute bottom-0 left-0 h-1 w-0 bg-gray-400"
              ></div>
            </div>

            <a href={URL} target="_blank" rel="noopener noreferrer">
              <Button primary>Get the book!</Button>
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Book
