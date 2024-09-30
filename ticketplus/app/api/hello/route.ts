export async function GET(request: Request) {

  console.log("the endpoint was hit")
  return new Response('Hello, Next.js!')
}
