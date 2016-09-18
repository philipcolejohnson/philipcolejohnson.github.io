---
layout: default
title: Philip Cole Johnson's Projects
---

<div class="projects" id="projects">
  <h1 class="pageTitle">Projects</h1>

  <div>
    <div>
      <a href="https://boiling-eyrie-10872.herokuapp.com/"><img src="{{ '/assets/img/betterhome.jpg' | prepend: site.baseurl }}" alt="BetterHome"></a>
    </div>
    <div >
      <a href="https://boiling-eyrie-10872.herokuapp.com/"><h3>BetterHome</h3></a>
      <p>Discover the San Francisco neighborhood that best matches your needs. [<a href="https://github.com/philipcolejohnson/better_home">Github Repo</a>]</p>
      <ul>
        <li>RESTful Ruby on Rails and PostgreSQL back-end</li>
        <li>Integrates 7 REST APIs (Factual/Google Maps/Socrata/Trulia/Walkscore/Yelp/Zillow)</li>
        <li>Full authentication suite using OmniAuth and Devise</li>
        <li>Delayed jobs with dyno worker for email and scheduled API calls</li>
        <li>Developed during a 2.5 day hackathon</li>
      </ul>
    </div>
  </div>

  <hr><br>

  <div>
    <div>
      <a href="https://nameless-falls-74566.herokuapp.com/"><img src="{{ '/assets/img/danebook.jpg' | prepend: site.baseurl }}" alt="Danebook"></a>
    </div>
    <div >
      <a href="https://nameless-falls-74566.herokuapp.com/"><h3>Danebook</h3></a>
      <p>A social media web app for seafaring Scandinavians. [<a href="https://github.com/philipcolejohnson/project_danebook">Github Repo</a>]</p>
      <ul>
        <li>RESTful Ruby on Rails and PostgreSQL back-end</li>
        <li>Database supports self, polymorphic, 1:1, 1:X associations</li>
        <li>Photo storage utilizing Amazon S3</li>
        <li>Model, controller, and feature testing using RSpec, factory girl and shoulda gems</li>
      </ul>
    </div>
  </div>
  
</div>
