export default `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
  <style>
  body{background:#eee;font-size:0.875rem;font-family:arial;}
  .d-flex-wrap{display:flex;flex-wrap:wrap;}
  .nav{font-weight:bold;font-size:1rem;margin:1rem 0;padding:0.5rem 0;border-bottom:1px #ddd solid;position:sticky;top:0;background:#eee;}
  .nav span:not(:last-child):after{content:'/';margin:0 5px;}
  .wrap > div{margin:5px 0;min-width:240px;width:25%;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
  a {color:#1c68de;text-decoration:none;}
  a:hover{text-decoration:underline;color:#0d459a;}
  .wrap a{margin:0 1rem 0 5px;}
  @media screen and (max-width: 768px) {
    .wrap > div {width:50%;}
  }
  @media screen and (max-width: 576px) {
    .wrap > div {width:100%;}
  }
  .directory:before{content:'🗂️';}
  .file:before{content:'📄';}
  </style>
</head>
<body>
  <div class="nav d-flex-wrap">
    <% breadcrumbs.forEach(el => { %>
      <span>
      <% if(el.isCurrent) { %>
        <%= el.name %>
      <% } else { %>
        <a href="<%= el.link %>"><%= el.name %></a>
      <% } %>
      </span>
    <% }) %>
  </div>
  <div class="wrap d-flex-wrap">
  <% files.forEach(el => { %> 
    <div class="<%= el.type %>"><a href="<%= el.link %>"><%= el.name %></a></div>
  <% }) %>
  </div>
</body>
</html>
`;
