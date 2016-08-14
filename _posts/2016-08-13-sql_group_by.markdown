---
layout: post
title:  What the hell is GROUP BY? A brief, simple explanation for SQL beginners
date:   2016-08-13
---

<p class="intro"><span class="dropcap">O</span>f all the beginning SQL statements, GROUP BY gave me the most trouble when I was learning the language. It seemed very complicated: a lotta ins, a lotta outs, a lotta what-have-yous. Moreover, online guides offered insufficient explanation. I found myself gingerly pecking out lines and praying the right result appeared.</p>

But one shouldn't just thoughtlessly toss syntax together for a GROUP BY statement and hope for the best. This isn't 'Nam. There are rules. Which I'm here to teach you.

So without further ado, here's an abbreviated table of Coen brothers movies (chosen arbitrarily by how much I like them, with the addition of *The Lady Killers* because I felt I should include a bad one) to help us learn:

<img src="{{ '/assets/img/SQL_1.png' | prepend: site.baseurl }}" alt="Example Data">

## Aggregate Functions

The key to remember is that GROUP BY is only for aggregate functions. What are those? Let's start with the opposite. Non-aggregate statements like WHERE pull intact rows from the database table (and keep the columns you specified with the SELECT statement). Aggregate functions, on the other hand, do *not* pull rows from the table; instead they look at all the rows, perform an operation on them as a group, and return the result. By including even one aggregate function in the SELECT statement, the entire query changes nature so that it is *only* for aggregate values.

As an example, let's take the aggregate function SUM. With our example, we can use the a SUM(box_office) statement to give us the total earnings from the movies I included in the example table above.

{% highlight sql %}
SELECT SUM(box_office) AS 'Total in Millions'
FROM coen_movies
{% endhighlight %}

<img src="{{ '/assets/img/SQL_2.png' | prepend: site.baseurl }}" alt="Total">

There are two things that are probably obvious here, but I'll point them out anyway.

First, there is only one row. That's what aggregate functions do.

Second, the *only* column in our result is the summation column, which is of course because it is the only one included in the SELECT statement. To get that number, we had to take the value from *every* row in that column and sum them together. The rows were collapsed together into a single row instead of pulled separately. Remember that.

We can even use two aggregate functions in the same request. Let's add an AVG statement to find the average Rotten Tomatoes rating for these movies.

{% highlight sql %}
SELECT SUM(box_office) AS 'Total in Millions', AVG(rt_rating) AS 'Average Rating'
FROM coen_movies
{% endhighlight %}

<img src="{{ '/assets/img/SQL_3.png' | prepend: site.baseurl }}" alt="Total and Average">

Cool! Since each of these operations collapse *all* the rows into a single value, we can retrieve both results.

But what would happen if we tried something like adding a 'year' column to our SELECT statement, because we want to see what years these movies were released in?

{% highlight sql %}
SELECT year, SUM(box_office) AS 'Total in Millions'
FROM coen_movies
{% endhighlight %}

It doesn't work! We get an error that says 'year' must be in a GROUP BY clause. Why? Because all the rows were collapsed into a single value, and it's impossible to assign a single year to that total. It would have to be something like "1984-2010", but SQL won't do that for you automatically (it doesn't know those are years anyway). Remember, we're using an aggregate function, so we only get back data that has had an operation done to it. You could only use year if you also perform some function on the column so that it is able to return a single value that represents all the years, such as using MAX to return the latest year, for example. In our example statement here, however,  'year' had no aggregate function. Hence the error.

## GROUP BY

On to the main event.

Remember, GROUP BY is used *only* with aggregate functions. What it does is allow aggregate functions to return more than a single value for a given column by grouping rows together. We could, for instance, get the sum of the box office for each genre.

{% highlight sql %}
SELECT genre, SUM(box_office) AS 'Total in Millions', AVG(rt_rating) AS 'Average Rating'
FROM coen_movies
GROUP BY genre
{% endhighlight %}

<img src="{{ '/assets/img/SQL_4.png' | prepend: site.baseurl }}" alt="GROUP BY genre">

Here the GROUP BY makes sense. It groups the rows into separate chunks according to the genre, then collapses all the rows of these chunks into a single value. We get one average and one sum each for all the rows of comedies and one each for all the rows of dramas. We can think of this in English as something like, "The sum and average for all movies in the Drama genre. The sum and average for all movies in the Comedy genre."

Notice that although we didn't have any aggregate function for the 'genre' column values in the SELECT statement, the request works here because 'genre' is being used to group the rows. Every collapsed row has the same value for 'genre' (that's what the GROUP BY does), so SQL knows how to return only a single value for that column.

If we tacked on 'year' to our select statement again, we'd get the same error as before because again there are, for instance, many years for the 'Comedy' genre, and we can't collapse them. It would be like saying in English, "The release year for all the Coen brothers movies in the Comedy genre." That doesn't make sense because the movies don't all share the same year.

## GROUP BY With More Than One Value

Things are slightly more complicated when we have more than one argument for our GROUP BY clause, but we're now prepared for them. Really it's just grouping rows the same way we did with GROUP BY in the previous examples, but now we're getting even more granular. We can, for instance, first separate the rows into groups by genre, and then further separate them into smaller groups based on the sub-genre.

{% highlight sql %}
SELECT genre, sub-genre, SUM(box_office) AS 'Total in Millions', AVG(rt_rating) AS 'Average Rating'
FROM coen_movies
GROUP BY genre, sub-genre
{% endhighlight %}

<img src="{{ '/assets/img/SQL_5.png' | prepend: site.baseurl }}" alt="GROUP BY genre, sub-genre">

The two highlighted rows of these results are collapsed rows that had more than one movie. In other words, there was more than one Western Drama, and more than one Crime Comedy. The rest of the genre/sub-genre combinations had only one row, so though they were collapsed, they contain the data from that single movie.

Again, notice that both columns in the GROUP BY statement are *not* modified by aggregate functions in the SELECT statement. Likewise, *every* column that is *not* used in an aggregate function in the SELECT statement *must* be in the GROUP BY statement; otherwise there's no way to collapse all the values.

A good way to think of this request in English is, "Separate these movies by genre, than split those groups into even smaller groups based on their sub-genres, then find the sum and average for each small group." The first row of our result is, "Take all the movies that are both a drama and a Western, and give me their total box office haul and the average of all their ratings."

Another way one might think of GROUP BY is that each row of the result has a unique combination of all the GROUP BY elements—in other words, a unique composite key. We have a row for the unique combination of Drama-Western, which is different than Drama-Crime, which is also different from Comedy-Crime. You might also notice that *order in the GROUP BY statement doesn't matter*, since only the combination is important.

Finally, remember that it's possible to use GROUP BY even on virtual columns, not just actual columns in the database table. For example, here's an example that creates a new column that says the decade in which the movie was released, then does a GROUP BY clause on that column.

{% highlight sql %}
SELECT CASE WHEN year BETWEEN 1980 AND 1989 THEN '80s'
            WHEN year BETWEEN 1990 AND 1999 THEN '90s'
            WHEN year BETWEEN 2000 AND 2009 THEN '00s'
            ELSE '10s' END AS 'Decade',
       SUM(box_office) AS 'Total in Millions',
       AVG(rt_rating) AS 'Average Rating'
FROM coen_movies
GROUP BY 'Decade'
{% endhighlight %}

<img src="{{ '/assets/img/SQL_6.png' | prepend: site.baseurl }}" alt="GROUP BY Decade">

Cool, huh?

## In Conclusion

That's it! Once you understand GROUP BY, you can use it confidently in more complicated queries that involve joining multiple tables and/or pulling out sub-queries, and you won't feel you're out of your element.

Or at least that's, you know, my opinion, man.
