---
layout: post
title:  Credit Card Validation Ruby Problem
date:   2016-06-23
---

<p class="intro"><span class="dropcap">A</span>s a way to shore up my weaknesses as a developer, I've been taking Harvard's CS50 "Introduction to Computer Science" class online. Instead of Ruby (which I'm supposed to be practicing for my program at <a href="https://www.vikingcodeschool.com">Viking Code School</a>), the class uses the programming language C. Fortunately, I first started coding in C and C++ many years ago, so the language isn't completely unfamiliar; the bad news is that I've now gotten somewhat spoiled by Ruby and other higher-level languages, so coming back to C's memory management and extensive use of pointers is somewhat jarring.</p>

In other words, I'm enjoying myself.

However, I do need to practice Ruby, too, so I've done a few of the practice problems in both Ruby and C. As expected, Ruby was a lot simpler, and allowed me to focus on the challenge at hand rather than banging my head against the table because I forgot to pass to a function a pointer rather than a variable.

One such problem from the class (in the more difficult "Hacker Edition") is credit card number validation, a tool which is indeed useful for the real world. There is a formula for creating the numbers, and thus also an [algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) for validation. To summarize, one must basically double every other digit of the number, add the digits of these doubled numbers together, then add this sum to the total to the remaining digits added together. If the total sum is divisible by ten, it's a valid credit card (or, at least, it could be).

So how to do this is in Ruby? First, we need to separate the digits. One might take in a string, separate the characters, then convert them to integers and store them in an array. However, that seemed like it an extra step or two. Instead, I inputted the card number as an integer and took a mathematical approach. (In my C version, I was puzzled for a long time because I failed to use a long long data type and didn't realize there wasn't enough memory for the card number.)

To separate each digit, we can use the division and mod operations. Let's take as an example the fake but passable credit card number 378,282,246,310,005 (I made it into an integer and added commas). Let's say we want to know what digit is in the hundred-thousands place—a 3 in this example. What we can do to eliminate all the numbers before it is use the mod operator, a tool which gives us the remainder of division operations. So we take this huge number and mod (%) by 378,282,246,000,000. It obviously divides once, leaving us a remainder of 310,005.

Now we just need that first digit. We get this by using the handy division operator, which for an integer says how many times a divisor goes into the number and ignores the remainder. For example, 5/2 = 2, because two goes into five two times, and we ignore the remainder. If we take our 310,005 and divide by 100,000 (a 1 digit in the place we need and 0s everywhere else), we get 3, which is exactly what we want. Here is my code:

{% highlight ruby %}
digits = Array.new
divisor = 10 

16.times do |counter|
    digits[counter] = number%divisor/(divisor/10) 
    divisor *= 10
end
{% endhighlight %}

For our credit card algorithm, I used this technique to place all the digits into array in reverse order (since order doesn't matter for the check). I start by getting the last digit, the digit in the ones place, by modding 10 (one digit to the left of the one I want), then dividing by 1 (i.e. 10/10, since I want the next digit over). Then I multiply the divisor by 10, in order to catch the next digit to the left, the tens place. The variable <code>divisor</code> is now 100. So I mod 100 to cut everything to the left of the tens digit, then divide by 10 (i.e. 100/10) to collect the only digit I want. I repeat this for the other 14 numbers and voila! I have the entire array.

The rest is straightforward. First, I take every other digit, double it, and add the digits to the total. I didn't want to bother separating strings again, so instead I made a condition: if the digit was five or higher—and thus would double to 10 or greater—I did a mod 10 and added one. For example, a '6' would double to 12, and separating the digits would give us 1 + 2 = 3 for our total. Instead I did <code>12 % 10</code> = 2 and added one, since the first digit would always be one.

{% highlight ruby %}
total = 0

16.times do |counter|
    if counter % 2 != 0  # we want the odd addresses or digits[1], [3], etc.
        if digits[counter] > 4
            total += 1 + digits[counter] * 2 % 10
        else
            total += digits[counter] * 2
        end
    end
end
{% endhighlight %}

Then I simply added the other digits together. However, instead of checking each element of the array to see if the digit was even, I instead did eight iterations and used <code>counter * 2</code> to find the element I wanted.

{% highlight ruby %}
8.times do |counter|
    total += digits[counter*2]
end
{% endhighlight %}

Finally I took this total and checked whether it's evenly divisible by ten. If so, it's a valid credit card number.

{% highlight ruby %}
if total % 10 == 0
    puts "Legit"
else
    puts "Invalid"
end
{% endhighlight %}

If desired, we can also look at the first digit of the credit card number to verify that it's from a valid company (and indeed to see which company issued the card).

And now we can have an easy first-pass check for our shopping site that saves the trouble of trying to send false or mistyped numbers to the credit card database!