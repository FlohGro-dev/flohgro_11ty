---
layout: layouts/base
title: archive
eleventyNavigation: 
    key: archive
    order: 4
---

## archive of all posts

{% for post in collections.posts %}
  - [{{ post.data.title }}]({{ post.url }}) - {{ post.data.date | isoDate }}
{% endfor %}

{% include "std-icons.md" %}