;(async () => {
  if (document.location.pathname.includes("canvas")) {
    // await import("stuff.js");
    await import("./canvas.css")
    // Like confetti! Which you have to import this special way because the web
    const { default: canvasLoad } = await import("./canvas.js")
    canvasLoad()
  }
})()
