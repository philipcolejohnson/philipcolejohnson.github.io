---
layout: post
title:  A Smooth Array Operator
date:   2016-07-10
---

<p class="intro"><span class="dropcap">W</span>hile working on implementing a Mastermind game this week, I discovered I basically needed a new array operator. The trouble began when I ran into the issue of determining the number of correct and misplaced pegs in a player's guess. For example, let's say the secret code is:</p>

[ (1)red (2)yellow (3)blue   (4)blue   (5)red (6)yellow ]<br>

and the player's guess was:<br>
<br>
[ (1)red (2)blue   (3)yellow (4)yellow (5)red (6)yellow ]<br>

This means that positions 1, 5, and 6 are exactly correct. Meanwhile, in the player's guess, peg 2 should be in position 3, and 3 should be in 2. Finally, position 4 is completely wrong. To sum up, we have 3 correct and 2 misplaced pegs.

It was easy to check for the number of correct pegs:

{% highlight ruby %}
def count_correct(move)
    count = 0
    move.each_index do |index|
      count += 1 if move[index] == solution[index]
    end
    count
  end
{% endhighlight %}

To count the misplaced pegs, I ended up creating a solution that iterated through the guess and altered the solution array so pegs would not be counted more than once. I ended up with this:

{% highlight ruby %}
def count_misplaced(move, solution)
  # duplicate the arrays, so we don't change the originals
  move = move.dup
  solution = solution.dup

  # elimate guesses that were correct
  move.length.times do |count|
    solution[count] = nil if move[count] == solution[count]
  end
  
  # count guesses that were in the wrong spot
  count = 0
  move.each do |element|
    solution.each_index do |index|
      if solution[index] == element
        solution[index] = nil
        count += 1
        break
      end
    end
  end
  count
end
{% endhighlight %}

It works, but I thought there must be a more elegant solution. My first idea was to somehow use array operators as a sly way of accomplishing basically what I had already implemented. Eventually, I came up with an algorithm that might solve the problem. My idea was to take the two arrays and eliminate the guesses that were exactly correct. From our example above, that would leave us with:

Solution array:<br>
[ (2)yellow (3)blue   (4)blue ]<br>

Guess array:<br>
[ (2)blue   (3)yellow (4)yellow ]<br>

Now I could count the differences between these two arrays to determine how many were in the wrong spot.

When I tried to implement the first step (eliminating items that were the same) of the procedure, however, it turned out to be less straightforward than I anticipated. I worked with one of our instructors on the problem, and we eventually came up with this:

{% highlight ruby %}
def eliminate_duplicates(array_one, array_two)
  no_dups = array_one.zip(array_two).select { |item| item[0] != item [1]}
  no_dups.transpose
end
{% endhighlight %}

With this function we can now do this:

{% highlight ruby %}
array_one = [ 2, 4, 6, 8, 10, 12 ]
array_two = [ 3, 4, 5, 6, 10, 11 ]

short_array_one, short_array_two = eliminate_duplicates(array_one, array_two)

short_array_one # => [2, 6, 8, 12]
short_array_two # => [3, 5, 6, 11]

{% endhighlight %}

As you can see, the places where the same numbers were in the same position were eliminated. Neat trick, eh?

This taught me two new methods. The <code>#zip</code> method merges two arrays into one, keeping both elements in each position:

{% highlight ruby %}
array_one = [ 2, 4, 6, 8, 10, 12 ]
array_two = [ 3, 4, 5, 6, 10, 11 ]

array_one.zip(array_two)
# => [[2, 3], [4, 4], [6, 5], [8, 6], [10, 10], [12, 11]] 

{% endhighlight %}

The other was <code>#transpose</code>, which only works on an array of arrays, and switches the rows and columns.

{% highlight ruby %}
array = [[2, 3], [4, 4], [6, 5], [8, 6], [10, 10], [12, 11]]

array.transpose
# => [[2, 4, 6, 8, 10, 12], [3, 4, 5, 6, 10, 11]] 

{% endhighlight %}

And that leaves me with a smooth little operator to remove like elements in two arrays.