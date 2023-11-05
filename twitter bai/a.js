var fly=require("flyio")

fly.get('https://twitter.com/emeralda__/status/1677286412323000321')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
