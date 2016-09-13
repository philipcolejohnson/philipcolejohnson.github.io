---
layout: post
title:  Unique URL Algorithm
date:   2016-09-11
---

<p class="intro"><span class="dropcap">F</span>or this round of algorithms, we've moved on from Ruby to JavaScript. I'll get right to the challenge, which is one that was taken from a Google interview.</p>

## The Problem
Given a very long list (millions!) of URLs, find the *first* URL which is unique (occurs exactly once). Try to do in a single pass.


## First Solution

It's late and I have other homework to do, so I'll keep this brief.

A first, naive idea might be solving the problem through a sorting process; however, we must remember we're looking for the *first* unique URL that appears, and a sorted list doesn't guarantee that. Also, even if we only went through the list and grouped like items together, a sort takes a lot of memory and processing time.

A better approach might be to store the URLs in a hash, or rather an object, since we're using JavaScript. The same problem arises, however: we're not guaranteed to find the first unique URL by simply iterating through the hash.

So one idea might be to use a hash, but also keep a separate list of unique URLs handy. That way, whenever we encounter a URL we've seen before, we can simply remove it from the list. At the end of our run, we just pluck the first item still remaining on our unique list, if any.

Here is my implementation. I used a linked list for the list of unique URLs.

{% highlight javascript %}
function uniqueURL(url) {
  this.next = null;
  this.prev = null;
  this.url = url;
}

var firstURL = function (urls) {
  var list = {};

  var uniques = new uniqueURL(null);
  var last = uniques;

  for (var i = 0; i < urls.length; i++) {
    if (list[urls[i]]) {
      // remove it from unique list
      var currentItem = uniques;
      var prevItem;
      while (currentItem.next !== null) {
        prevItem = currentItem;
        currentItem = currentItem.next;

        // if we've found our url, delete the node
        if (currentItem.url === urls[i]) {
          if (currentItem === last) {
            last = prevItem;
          } else {
            currentItem.next.prev = prevItem;
          }
          prevItem.next = currentItem.next;
          currentItem.next = null;      
        }
      }
    } else {
      // add it to the list and unique list
      list[urls[i]] = true;
      last.next = new uniqueURL(urls[i]);
      last.next.prev = last;
      last = last.next;
    }

  }

  // print the first item off our list
  if (uniques.next === null){
    return null;
  } else {
    return uniques.next.url;
  }
};
{% endhighlight %}

Then I tested it using a sample list.

{% highlight javascript %}
var urlList = [
   "www.google.com/search",
   "facebook.com",
   "www.google.com",
   "www.vikingcodeschool.com",
   "www.yahoo.com",
   "facebook.com",
   "www.yahoo.com",
   "www.amazon.com",
   "facebook.com",
   "www.google.com",
   "www.google.com/search"
   ];

console.log("First unique: " + firstURL(urlList));
// => First unique: www.vikingcodeschool.com
{% endhighlight %}

This works, but there's a problem. Everytime we hit a URL that's already been seen, we have to potentially traverse the entire linked list before we can remove the item. (I used a doubly linked list because deleting from an array would be even more costly.) So maybe there's a better solution?

## Yes, There's A Better Solution

What if we stored somewhere a link to the actual item in our linked list? Then we could just jump there directly and delete it in O(1) time.

This can be accomplished by changing the way we store our URLs. Instead of using a hash table like before, we can instead use a trie. That way, we can store the reference to the unique list node directly on the trie, enabling us to skip the step of running through our unique list every time we want to delete an item.

Here's my implementation.

{% highlight javascript %}
function Node(data) {
  this.data = data;
  this.count = 0;
  this.children = {};
  this.link = null;
}

function uniqueURL(url) {
  this.next = null;
  this.prev = null;
  this.url = url;
}

var firstURL = function (urls) {
  var list = new Node(null);
  var uniques = new uniqueURL(null);
  var last = uniques;

  for (var i = 0; i < urls.length; i++) {
    var currentNode = list;
    for (var j = 0; j < urls[i].length; j++) {
      // add the element to the trie if it doesn't exist
      if (!currentNode.children[urls[i][j]]) {
        currentNode.children[urls[i][j]] = new Node(urls[i][j]);  
      }
      currentNode = currentNode.children[urls[i][j]];
    }

    // change the information on the last node of the trie
    currentNode.count++;
    if (currentNode.count === 1) {
      last.next = new uniqueURL(urls[i]);
      last.next.prev = last;
      last = last.next;
      currentNode.link = last;  // remember this item in our trie
    } else  {
      // delete this from our unique list, using our link
      var currentItem = currentNode.link;
      if (currentItem === last) {
        last = currentItem.prev;
      } else {
        currentItem.next.prev = currentItem.prev;
      }
      
      currentItem.prev.next = currentItem.next;
    }
  }

  // print the first item off our list
  if (uniques.next === null){
    return null;
  } else {
    return uniques.next.url;
  }
};

console.log("First unique: " + firstURL(urlList));
// => First unique: www.vikingcodeschool.com
{% endhighlight %}

And there we have it: O(n) time with a single pass through this long list of URLs.

