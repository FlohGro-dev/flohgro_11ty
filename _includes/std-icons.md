<hr>

<ul class="std-icons">
    {% for link in stdLinks.stdLinks %}
        <li>
            <a href="{{ link.url }}" target="_blank">
                <img src="{{ baseUrl }}{{ link.icon }}" alt="{{ link.name }}"></a>
        </li>
    {% endfor %}
</ul>

<hr>