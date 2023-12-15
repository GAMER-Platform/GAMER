$("#loginForm").submit(function(e){
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/signin",
      data: $(this).serialize(),
      success: function(data)
      {
        if(data.redirect) {
          window.location.href = data.redirect;
        }
      },
      error: function(xhr, status, error)
      {
        var errorMessage = JSON.parse(xhr.responseText).error;
        alert(errorMessage);
      }
    });
  });