---
layout: post
title:  Scrambled Letters
date:   2016-06-13
---

<p class="intro"><span class="dropcap">I</span>’ve encountered floating around on Facebook from time to time posts that “prove” the power of human brains to understand language; our minds, so goes the claim, can easily read words even when they are scrambled, provided that the first and last letters remain in place. For instance, the post usually provides a passage like this one:</p>

<q>Aoccdrnig to a rscheearch at Cmabrigde Uinervtisy, it deosn’t mttaer in waht oredr the ltteers in a wrod are, the olny iprmoatnt tihng is taht the frist and lsat ltteers be at the rghit pclae. The rset can be a toatl mses and you can sitll raed it wouthit porbelm. Tihs is bcuseae the huamn mnid deos not raed ervey lteter by istlef, but the wrod as a wlohe.</q>

Regardless of whether this claim is [actually true](http://www.mrc-cbu.cam.ac.uk/people/matt.davis/cmabridge/), it sounds like the perfect opportunity for a coding exercise. In fact, I found one at [RubyQuiz](http://rubyquiz.com/quiz76.html).

Our task is to take a string of perfect text, carefully corrected by a hard-working and underpaid copyeditor, and garble it (though keeping the first and last letters and punctuation in place) so that Facebook posters can thoughtlessly spread misinformation. Because it is the 400th anniversary of Shakespeare’s death, I chose this famous soliloquy:

<q>To be, or not to be: that is the question:<br>
Whether ’tis nobler in the mind to suffer<br>
The slings and arrows of outrageous fortune,<br>
Or to take arms against a sea of troubles,<br>
And by opposing end them? To die: to sleep;<br>
No more; and by a sleep to say we end<br>
The heart-ache and the thousand natural shocks<br>
That flesh is heir to, ’tis a consummation<br>
Devoutly to be wish’d. To die, to sleep;<br>
To sleep: perchance to dream: ay, there’s the rub</q>

This passage also has the additional challenges of new-line characters and punctuation at the beginning of words, a welcome complexity.

My first idea was to split the text and place all the words in an array (and, indeed, this was the same approach taken by almost all my classmates at [Viking Code School](https://www.vikingcodeschool.com/) when I posed the problem). This was easy enough to accomplish with <code>text.split</code>. However, because of the punctuation at the beginning and end of words, I had to determine the position of the first and last letters of each word in the array, and only then scramble the middle with <code>#sort_by {rand}</code>. My initial attempt at the code worked, but was quite complex.

{% highlight ruby %}
def scrambler(text)
  scrambled_text = []

  text.split.each do |word|
    #take off punctuation
    letters = word.split(‘’)
    letters_without_punctuation = []
    first_letter = last_letter = nil
    letters.each_with_index do |character, index| 
      if (‘A’..’z’) === character
        letters_without_punctuation << character
        first_letter ||= index
      else
        last_letter = (index - 1) if first_letter && !last_letter
      end
    end

    #scramble middle letters
    if letters_without_punctuation.length > 3
      word_without_punctuation = [letters_without_punctuation[0], letters_without_punctuation[1..-2].sort_by {rand}, letters_without_punctuation[-1]].join
    else
      word_without_punctuation = letters_without_punctuation.join
    end

    #add word with punctuation
    prefix = word[0…first_letter]
    postfix = word[(last_letter+1)..-1] if last_letter
    scrambled_word = “#{prefix + word_without_punctuation}”
    scrambled_word += “#{postfix}” if postfix

    scrambled_text << scrambled_word
  end

  scrambled_text.join(‘ ‘)
end
{% endhighlight %}

Yikes. There had to be a better strategy. My next idea was to split the text differently, and by using the regular expression <code>/\b/</code>, which splits on word boundries, I shortened my function significantly.

{% highlight ruby %}
def scrambler(text)
  scrambled_text = []

  text.split(/\b/).each do |word|
    if word.length > 3
      middle = word[1..-2].split(‘’).sort_by { rand }         #shuffle
      scrambled_text << word[0] + middle.join(‘’) + word[-1]
    else
      scrambled_text << word
    end
  end

  scrambled_text.join(‘’) 
end
{% endhighlight %}

However, this still could be improved. After some thought, I realized there was no need to actually make an array. Because I was replacing text in a string, a simpler approach was to simply search the string for letters and substitute in the scrambled text. For this I used <code>#gsub</code>. We only need to find words longer than four letters, since anything shorter would remain unchanged. Thus, my new search pattern: <code>/\w{4,}/</code>. Now I could easily scramble the middle letters, as I would no longer be dealing with punctuation.

{% highlight ruby %}
def scrambler(text)
  text.gsub(/\w{4,}/) do |word|
    middle = word[1..-2].split(‘’).sort_by { rand }
    word[0] + middle.join(‘’) + word[-1]
  end
end
{% endhighlight %}

So this was my final version. However, on the RubyQuiz page, someone else had posted an even shorter answer that uses a very complex regular expression.

{% highlight ruby %}
text.gsub(/\B((?![\d_])\w{2,})\B/) do |w|
    ($&.split(//).sort_by { rand }).join
  end
{% endhighlight %}

This was beyond my skill level with regular expressions, but of course I was impressed. It could be shortened into a single line!

And, of course, the final result, which unfortunately proves to be almost as readable as the claims suggest, though the answer to the bard’s question proves no simpler:

<q>To be, or not to be: taht is the qeutiosn:<br>
Wehethr ’tis nlebor in the mind to sufefr<br>
The sinlgs and arwors of ogtureoaus fnroute,<br>
Or to tkae arms agsaint a sea of tbreouls,<br>
And by osopinpg end them? To die: to seelp;<br>
No more; and by a selep to say we end<br>
The herat-ache and the tuahonsd naatrul skochs<br>
That flseh is hier to, ’tis a cumoitnomasn<br>
Dtvleuoy to be wsih’d. To die, to sleep;<br>
To sleep: pacrncehe to dearm: ay, there’s the rub</q>