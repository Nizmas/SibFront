export function sendRequest(type, options) {
  console.log(type, options);
  const request = new XMLHttpRequest();
  let param;
  switch (type) {
    case "read":
      param =
        options.data.id == undefined
          ? "data"
          : "childrens?parentId=" + options.data.id;
      break;

    case "update":
      param = "update";
      break;

    case "create":
      param = "create";
      break;

    case "destroy":
      param = "delete";
      break;

    default:
      return;
  }

  if (type == "read") {
    request.open("GET", "https://localhost:5001/projects/" + param);
    request.setRequestHeader("Content-Type", "application/x-www-form-url");
  } else if (type == "update" || type == "create" || type == "destroy") {
    request.open("POST", "https://localhost:5001/projects/" + param);
    request.setRequestHeader("Content-Type", "application/json");
  }

  request.addEventListener("readystatechange", () => {
    if (request.readyState === 4 && request.status === 200)
      if (type == "read" || type == "create")
        options.success(JSON.parse(request.responseText));
      else {
        alert("Данные успешно обновлены");
        options.success();
      }
    else if (request.status !== 200)
      alert("Проверьте правильность введённых данных!");
  });

  if (type == "read") {
    request.send();
  } else if (type == "update" || type == "create" || type == "destroy") {
    request.send(JSON.stringify(options.data));
  }
}
