async function getImgUrlByName(name: string) {
  const url = `https://api.bgm.tv/search/subject/${name}?type=2`
  const encodedUrl = encodeURI(url)
  let id: string | undefined
  try {
    await fetch(encodedUrl)
      .then(response => response.json())
      .then((data) => {
        if (data.results !== 0)
          id = data.list[0].id
      })
  }
  catch (error) {
    console.error(error)
  }
  return id
}

export { getImgUrlByName }
