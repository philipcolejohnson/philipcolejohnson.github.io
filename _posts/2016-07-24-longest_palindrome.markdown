---
layout: post
title:  Constructing The Longest Palindrome
date:   2016-07-24
---

<p class="intro"><span class="dropcap">M</span>y task today is to find the longest possible palindrome able to be constructed from a list of characters.</p>
I began with brainstorming a solution. After a little thought, I had a first approach.

1. Sort the characters so that they are grouped together.
2. Go through each character. If it has a match, keep it.
3. If the character doesn't have a match, save it as the middle character, if there isn't one already.
4. Go through the resulting characters. If the character is in an even position (the first of a pair), add it to the left half of the string. Otherwise add it to the right.
5. Put the two halves together.

I coded this up with this result:

{% highlight ruby %}
def longest_palindrome(characters)
  # sort list
  characters = characters.split('').sort.join

  # look for pairs and a middle character
  letter_index = 0
  keep = ""
  while letter_index < characters.length
    if letter_index < characters.length + 1 && characters[letter_index]==characters[letter_index + 1]
      letter_index += 1
      keep << characters[letter_index] * 2
    else
      middle ||= characters[letter_index]
    end
    letter_index += 1
  end
  keep << middle if middle

  # sort the remaining pairs into one half or the other
  left_half = ""
  right_half = ""
  keep.split('').each_with_index do |letter, index|
    if index.even?
      left_half << letter
    else
      right_half << letter
    end
  end

  # put the two halves together, making sure the right half is the reverse
  left_half + right_half.reverse
end

{% endhighlight %}

To test my results, I tried a few combinations:

{% highlight ruby %}

p longest_palindrome('aha')       # "aha"
p longest_palindrome('ttaatta')   # "attatta"
p longest_palindrome('abc')       # "a"
p longest_palindrome('gggaaa')    # "agaga"

{% endhighlight %}

Now to figure out the Big O of my solution. Sorting takes, at best, O(n log n) time. How about the rest though? Step one, finding all the pairs, requires only a single traversal of the list, which is of course the minimum. That's O(n + n log n) so far.

The next intensive part of the algorithm is constructing the palindrome string. In my solution, that requires going once through all the characters I saved from the first string; at worst, I needed to keep all of them, so this is another O(n) step. Afterwards, I had to add these saved characters to one of two new strings representing half of the final palindrome. This process also requires a step for each character that was saved.

Finally, I had to put the two halves together, including a reversal of the second half string. The reversal takes n steps, as does connecting the two strings, since I needed to traverse both to construct our final string. In all, I went through the list four times, O(4n), plus I sorted the list. leaving me with a final Big O of O(n log n). This is the best for which I can hope using a sort.

However, I saw opportunities to speed up the process. For example, why was I saving two characters, when the second was always a copy of the first? I can refactor to save only one:

{% highlight ruby %}

keep << characters[letter_index]  # not * 2,

{% endhighlight %}

This means when I'm constructing the final palindrome, I only need to go through half the characters I did before. That doesn't change the Big O time, but nevertheless it's faster.

{% highlight ruby %}

left_half = ""
keep.split('').each_with_index do |letter, index|
    left_half << letter
end

left_half + (middle ? middle + left_half.reverse : left_half.reverse

{% endhighlight %}

But then again, why am I making a new string at all? I simplified by just adding the reverse to the letter pairs I kept.

{% highlight ruby %}

keep + (middle ? middle + keep.reverse : keep.reverse)

{% endhighlight %}

Much simpler! Where does that leave us with efficiency? Once through and a sort at start of course. But now the next part, making the palindrome, only requires at most n/2 steps to reverse the string (since we have at most half our original elements), then another n steps to add the two string halves together. That's O(n + n/2 + n) = O(n(1 + 1/2 + 1)) = O(2.5n) for everything besides the sort. It's faster and takes less memory than the original solution.

Obviously, the real way to speed things up is to eliminate the sort. I realized upon some reflection that I could accomplish this by using a hash to keep track of the number of times each letter appears. Then I could use even counts to construct palindrome pairs, and one odd count (if necessary) for the middle letter. Here is my implementation:

{% highlight ruby %}

def longest_palindrome(characters)
  letters = Hash.new(0)
  characters.split('').each do |char|
    letters[char] += 1
  end

  keep = ""
  middle = nil
  letters.each do |letter, count|
    if count.even?
      (count / 2).times { keep << letter }
    else
      middle ||= letter
      ((count - 1) / 2).times { keep << letter }
    end
  end

  keep + (middle ? middle + keep.reverse : keep.reverse)
end

{% endhighlight %}

This produces palindromes of equal length (though sometimes they are different than the first solution produced). However, now that I have eliminated the sort, the algorithm runs in O(n) time.
