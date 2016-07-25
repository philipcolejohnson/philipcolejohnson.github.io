---
layout: post
title:  Sorting Out A Linked List
date:   2016-07-17
---

<p class="intro"><span class="dropcap">L</span>inked lists can sometimes be a better fit than an array for an application's data structure. However, sorting a linked list in Ruby is not as straight-forward as sorting an array, as there are no built-in methods.</p>

A useful exercise is to write a method that sorts a list of integers. As preparation for the problem, I first constructed a linked list of unsorted integers.

{% highlight ruby %}
Node = Struct.new(:data, :next)

list = Node.new(6, nil)
current_node = list
[5, 10, 3, 5, 7, 8, 5, 10, 1].each do |num|
  current_node.next = Node.new(num, nil)
  current_node = current_node.next
end

# 6 -> 5 -> 10 -> 3 -> 5 -> 7 -> 8 -> 5 -> 10 -> 1

{% endhighlight %}

Now how to approach the problem?

One method might be to traverse the list, collecting all the items in an array. Then we can sort the array and rebuild the list in order.

How long would this approach take? Let's go through the steps. First, we must do an initial traversal of our list. Since we have *n* nodes in our linked list, that means we have a cost of *n* steps so far. Now that we have an array, we can use any number of sorting methods to put them in order. The simplest way is to just use Ruby's array sort method:

{% highlight ruby %}
array = [6, 5, 10, 3, 5, 7, 8, 5, 10, 1]
array.sort

# => [1, 3, 5, 5, 5, 6, 7, 8, 10, 10]
{% endhighlight %}

However, if we were to write our own, we might use an efficient method like a Merge Sort. (With such a small array, another method might be more appropriate, but let's assume we're writing a method that could be used on a list of any size.) A Merge Sort works in O(n log n) time, giving us O(n + (n log n)) time after both creating the array and sorting it.

The final process is to traverse our sorted array and build a new linked list. This, of course, will take *n* steps. That leaves us with O(2n + (n log n)). If we divide out the *n*, we get O(n(2 + log n)), which is basically O(n log n), the Big O of the sort. This is the best we can hope for, since the sort can't get any faster.

The question is, do we need a sort? There's a trick we can use to reach O(n), though only under certain conditions, which is a list of limited range and a finite set of values (e.g. integers or letters). This might occur in real life when sorting, for example, a list of users' ages.

Instead of trying to sort the data, I traversed the list once and kept track in a hash of the number of times each integer was used. I also kept track of the maximum and minimum of the set so that I could use it in the next step.

{% highlight ruby %}
def sort_list(list)
  items = Hash.new(0)         # the default value is 0
  current_node = list
  until current_node.nil?
    min ||= max ||= current_node.data
    items[current_node.data] += 1
    max = current_node.data if current_node.data > max
    min = current_node.data if current_node.data < min
    current_node = current_node.next
  end
end
{% endhighlight %}

That gives us O(n) so far, since we've traversed the list once. Now, instead of sorting the list, we just have to reconstruct it in order. To do this, I started at the minimum and counted up to the maximum, using my hash count to insert the correct number of nodes for each integer that was present in the original array.

{% highlight ruby %}
def sort_list(list)
  .
  .
  .

  new_list = nil
  (min..max).each do |count|
    items[count].times do
      if new_list.nil?
        current_node = new_list = Node.new(items[count], nil)
      else
        current_node = current_node.next = Node.new(count, nil)
      end
    end
  end
  new_list
end
{% endhighlight %}

This process runs longer than *n* times since I am iterating through numbers that I don't use. Of course, as I mentioned, this only works on lists of a finite set (it wouldn't work on floats, for instance), and also of limited range. With an unknown range, the Big O would be infinity (or at least the maximum value of integers) since the list could have a huge range, e.g. a list like <code>0 -> 1 -> 100_000_000_000_000</code>. However, in certain circumstances in which we knew our numbers would have a much narrower range (less than, say, n log n), this method would be faster, because the rebuilding of list would take give us an O(n + max - min), which, ignoring the constants, means the method is O(n), linear time.

So, we're now left with a method that could potentially be much faster than using a sorting method. Perhaps the next step in improving the method would be to determine by the range which method is more appropriate.

Anyway, here's the final, full method for creating a sample list, sorting it, and displaying the results:

{% highlight ruby %}
Node = Struct.new(:data, :next)

list = Node.new(6, nil)
current_node = list
[5, 10, 3, 5, 7, 8, 5, 10, 1].each do |num|
  current_node.next = Node.new(num, nil)
  current_node = current_node.next
end

def print_list(list)
  print "#{list.data}"
  current_node = list.next
  until current_node.nil?
    print " -> #{current_node.data}"
    current_node = current_node.next
  end
  puts
end

def sort_list(list)
  items = Hash.new(0)
  current_node = list
  until current_node.nil?
    min ||= max ||= current_node.data
    items[current_node.data] += 1
    max = current_node.data if current_node.data > max
    min = current_node.data if current_node.data < min
    current_node = current_node.next
  end

  new_list = nil
  (min..max).each do |count|
    items[count].times do
      if new_list.nil?
        current_node = new_list = Node.new(items[count], nil)
      else
        current_node = current_node.next = Node.new(count, nil)
      end
    end
  end
  new_list
end

print_list(list)
print_list(sort_list(list))
{% endhighlight %}
