## Cross-site Scripting (XSS)

#### Description

Cross-Site Scripting is a vulnerability that occurs when user-supplied data is unsafely rendered back in an application. When malicious data is rendered to the front end views without any escaping, the user's browser may be hijacked or commanded for malicious purposes.

XSS flaws usually rely on executing JavaScript in the user's browser, but can occur in a wide variety of settings beyond the common ```<script>``` tag. HTML is a versatile language, and JavaScript can be executed from within HTML attributes, CSS, or even from within JSON payloads.

Most common XSS attacks attempt to either steal user cookie information (containing their site session), browser information, account contents, or other sensitive information. It's also possible to force the user's browser to navigate to an attacker controlled server for further exploitation.

There are usually two broad forms of XSS: stored XSS, and reflected XSS. Reflected XSS is usually parsed from a URL or some other client-only input, and affects the user without any interaction from the server. Reflected XSS is much harder to detect, since there is no interaction with the server as the user is hijacked. On the other hand, stored XSS is usually sent as input to the server and saved in a database. Any time the page with the payload is loaded, it will replay the exploit. While easier to detect, stored XSS can have a wider reaching impact on the end user.

#### Problem
URL: http://localhost:8081/listings

node.nV uses the EJS templating language to render its frontend views. However, throughout almost the entire application it does not adequately protect against XSS! Although there is no indication in the templates that the outputs are "insecure", simplying using the ```<%- %>``` syntax does not perform any encoding by default. In the "listing" example, the values stored in the application database are printed out by the loop are raw; if a listing name contained a script tag, it would be output to the page directly and treated as HTML.

#### Walkthrough
1. Log into the app using the credentials er1:abc123!!
2. Click on Create listings tab.
3. In the Description section of the listing add a <script>alert(1)</script>.
4. Navigate to the listings tab,
  URL: http://localhost:8081/listings


As you have learned previously this could be any malicious payload that would be executed in your browser. We will use this test case to determine if the fix you apply is successful at mitigating the XSS injection.

#### Code Snippet
views/er/ersearch.ejs

```
  <% for(var i=0; i < listings.length; i++) { %>
        <tr> 
          <td> <%- listings[i].created %></td>
          <td><%- listings[i].name %></td>
          <td><%- listings[i].description %></td>
          <td><%- listings[i].deadline %>
          </td>
        <td>
            <a class="icon-eye-open pull-left" href="/editListing?id=<%= listings[i]._id %>" ></a>
            <a class="icon-remove pull-right" href="javascript:alert('Remove Listing')"></a></td>
        </tr>
        <% } %>
```

#### Solution

XSS requires a more proactive approach to mitigate in EJS templates than in other templating languages. While some other languages encode automatically, and require you to specifically mark variables you do not wish to encode, EJS templates do not always help. Therefore, it is extremely important to be careful when outputting variables in EJS templates.

When outputting variables to a page, ensure you properly HTML escape output with ```<%= %>``` tags.

```

  <% for(var i=0; i < listings.length; i++) { %>
        <tr> 
          <td> <%= listings[i].created %></td>
          <td><%= listings[i].name %></td>
          <td><%= listings[i].description %></td>
          <td><%= listings[i].deadline %>
          </td>
        <td>
            <a class="icon-eye-open pull-left" href="/editListing?id=<%= listings[i]._id %>" ></a>
            <a class="icon-remove pull-right" href="javascript:alert('Remove Listing')"></a></td>
        </tr>
        <% } %>

```




One potential problem with XSS is when a value starts in one context, and shifts to another. *Multiple context XSS* attacks, may start in the URL but then be output onto the page. In general, it is best to allow only the smallest subset of characters that are needed for the application to function.

There are also several useful HTTP headers your application can set to prevent XSS attacks. For example, setting ```X-XSS-Protection``` to 1 will ensure that the browser uses its built-in XSS protections. While this is usually enabled by default, it may not be on some older browsers. It's also worth setting a strong ```Content-Security-Policy``` header. While out of the scope of this document, CSP will help protect your site in a broader way than just against XSS.



  



