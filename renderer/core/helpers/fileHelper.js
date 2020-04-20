
const fs = require('fs').promises


///
/// Deletes strategy from file by id..
///
exports.deleteStrategyFromFile = async (id) => {
  console.log(`Deleting ${id}`)

  let successfullySaved = false

  const res = fs.readFile('./strategies.json', 'utf8')

  const json = await res.then(
    (data) => { return JSON.parse(data) }
  ).catch(
    (err) => console.error("File read failed:", err)
  )

  if (json) {

    console.log(json)

    // check if the strategies are identified uniquely  
    const filtered = json.filter(s => s.id != id)

    console.log(filtered)

    const str = JSON.stringify(filtered, null, 2)
    const writeRes = fs.writeFile("strategies.json", str, "utf8")
      
    successfullySaved = await writeRes.then(
      () => { return true }
    ).catch(
      (err) => {
        console.error("File read failed:", err)
        return false
      }
    )  
  } 
  return filtered;
}