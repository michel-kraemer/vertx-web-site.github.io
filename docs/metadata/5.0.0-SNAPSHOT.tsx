import oldDocs from "./4.4.4"
import { clone, insert, remove } from "./helpers"

const docs = clone(oldDocs)

insert(docs, "vertx-service-resolver", {
  id: "vertx-service-resolver",
  name: "Vert.x Service Resolver",
  description:
    "Lets Vert.x clients call services using logical service names instead of network addresses for Kubernetes and such.",
  category: "microservices",
  href: "/vertx-service-resolver/java/",
  repository: "https://github.com/eclipse-vertx/vertx-service-resolver",
  edit: "https://github.com/eclipse-vertx/vertx-service-resolver/tree/main/vertx-service-resolver/src/main/asciidoc",
  label: "Technical Preview",
})

// remove old entries
remove(docs, "vertx-grpc")
remove(docs, "vertx-grpc-netty")
remove(docs, "vertx-lang-groovy")
remove(docs, "vertx-rx-java")
remove(docs, "vertx-service-discovery")
remove(docs, "vertx-web-api-service")

export default docs