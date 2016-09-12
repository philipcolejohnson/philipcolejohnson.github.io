---
layout: post
title:  Another Algorithm—Contiguous Sub Arrays
date:   2016-08-07
---

<p class="intro"><span class="dropcap">A</span>nnnnd we're back with another algorithm! Amazing! I went searching for algorithms given in job interviews and came across this one, that looked fun to try.</p>

### The Problem

Given an array of sorted positive integers and a target sum, find if there exists in the given array a contiguous sub-array whose sum equals the target sum.<br>

For example, let's say the given array is [2, 4, 7, 8].<br>
A target of 6 would return TRUE, as 2 + 4 = 6.<br>
A target sum of 5 would return FALSE.<br>
A target of 9 would return FALSE because 2 and 7 are not contiguous.<br>
A target sum of 19 or a target sum of 7 would both return TRUE.<br>

### A First Attempt

The first try at making a solution would take a brute force approach. We would start at the first element of the array, then start adding elements until we equal our target sum or go over it. If we hit our target, we can return true. Otherwise, we would move on to the next element of the array and start the process over again.

Here is a method I wrote that uses this approach:

{% highlight ruby %}
def contiguous_subarray(arr, sum)
  arr.each_index do |start|
    total = 0

    arr[start..-1].each do |element|
      total += element

      return true if total == sum  
      break if total > sum
    end
  end

  false
end
{% endhighlight %}

The nice thing about this approach is that the strategy is easy to follow. We loop through every element of the array, and for each we sum the elements that follow it, looking for our target sum. We return false at the end if we didn't find anything earlier.

However, let's look at the O(n). In the worst case scenario, we have to loop through every element of our array. For each of those, we have to (at worst) loop through all the remaining elements. Since there is one fewer argument each time, that means we take our n times through the outside loop and multiply it by *(n - 1) + (n - 2) + (n - 3) ...*, which means we have O(n^2).

### A Better Solution

Is there some way we can reduce the amount of times we need to loop through the elements? Is it possible to go through only once and achieve O(n) time?

Let's look at the example array again: [ 2 4 7 8 ]. A better way to think of the problem would be to imagine we are covering up part of the problem with our hands and looking at only a few elements at a time. We start by covering every element except the first: [ 2 _ _ _ ].

Let's say our target sum is 5. Is that first element 2 equal to 5? Of course not. So we move our right hand and reveal another element of the array so that now we have: [ 2 4 _ _ ]. We keep track of the sum so far, which is now 6. That is more than five, so we know that just adding another element would do no good.

Instead we use our other hand to cover up the left-most element of our window, leaving us with [ _ 4 _ _ ]. Since we took of the 2, we need to subtract it from our current total of 6, leaving us with a new current total of 4.

Our new total is too small, so we need to move our right hand again add a new element to our array: [ _ 4 7 _ ]. We add the 7 onto our current total of 4. That's too big, so we need to move our left hand and remove the 4. We continue to do this until we reach the end of the array. In this case, we'll never find a contiguous set of numbers that equal 5, so we return false at the end.

Here is a method I wrote that uses this approach:

{% highlight ruby %}
def contiguous_subarray(arr, sum)
  start = 0
  finish = 0
  total = arr[start]

  until finish == arr.length
    if total == sum
      return true
    elsif total > sum
      total -= arr[start]
      start += 1
    else
      finish += 1
      total += arr[finish] if finish < arr.length
    end
  end

  false
end
{% endhighlight %}

In this approach, we don't have a loop within a loop. In fact, we only traverse the array a single time at worst. That leaves us with an Big O of O(n). In terms of space, we only create three new variables, so we have O(1).
