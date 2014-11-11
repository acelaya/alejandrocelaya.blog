<?php
namespace Acelaya\Twig\Extension;

class TruncateHtmlExtension extends \Twig_Extension
{
    public function getName() {
        return 'truncatehtml';
    }

    public function getFilters() {
        return array('truncatehtml' => new \Twig_Filter_Method($this, 'truncatehtml', array('is_safe' => array('html'))));
    }

    public function truncatehtml($html, $minimum) {
        $oldDocument = new \DomDocument();
        $html = mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');
        $oldDocument->loadHTML('<div>' . $html . '</div>');

        // remove DOCTYPE, HTML and BODY tags
        $oldDocument->removeChild($oldDocument->firstChild);
        $oldDocument->replaceChild($oldDocument->firstChild->firstChild->firstChild, $oldDocument->firstChild);

        $currentLength = 0; // displayed text length (without markup)

        $newDocument = new \DomDocument();
        foreach($oldDocument->documentElement->childNodes as $node) {
            if($node->nodeType != 3) { // not text node
                $imported = $newDocument->importNode($node, true);
                $newDocument->appendChild($imported); // copy original node to output document
                $currentLength += strlen(html_entity_decode($imported->nodeValue));
                if ($currentLength >= $minimum) // check if the minimum is reached
                    break;
            }
        }

        $output = $newDocument->saveHTML();
        return html_entity_decode($output);
    }
}
 