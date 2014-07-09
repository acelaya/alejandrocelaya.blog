<?php
namespace AndrewShell\Twig\Extensions;

use Twig_Environment;
use Twig_Extension;
use Twig_Filter_Method;
use Twig_SimpleFunction;

class Text extends Twig_Extension
{
    public function getFilters()
    {
        $filters = array(
            'compact' => new Twig_Filter_Method($this, 'compactFilter'),
            'smartTruncate' => new Twig_Filter_Method($this, 'smartTruncate'),
        );

        return $filters;
    }

    public function getFunctions()
    {
        $functions = array(
            new Twig_SimpleFunction('lunr', array($this, 'lunrGenerator'), array('needs_environment' => true, 'is_safe' => array('html'))),
        );

        return $functions;
    }

    public function getName()
    {
        return 'AndrewShellText';
    }

    public function compactFilter($string)
    {
        return trim(preg_replace('!\s+!isU', ' ', $string));
    }

    public function smartTruncate($string, $length)
    {
        $string = trim($string);
        if (strlen($string) > $length) {
            $truncated = substr($string, 0, $length);
            $string = substr($truncated, 0, strrpos($truncated, ' ')) . html_entity_decode('&hellip;');
        }
        return $string;
    }

    public function lunrGenerator(Twig_Environment $env, $posts)
    {
        $data = array('entries' => array());
        foreach ($posts as $post) {
            $meta = $post->meta();
            if (isset($meta['exclude_from_search'])) {
                continue;
            }
            $blocks = $post->blocks();
            if (isset($blocks['content'])) {
                $content = $this->compactFilter(strip_tags($blocks['content']));
            } else {
                $content = '';
            }
            if (isset($meta['description'])) {
                $description = $meta['description'];
            } else {
                $description = twig_truncate_filter($env, $content, 280);
            }
            $data['entries'][] = array(
                'title' => $this->compactFilter(strip_tags($post->title())),
                'url' => $post->url(),
                'date' => date('Y-m-d H:i:s O', $post->date()),
                'body' => htmlentities($content, ENT_COMPAT, "UTF-8", $double_encode = false),
                'description' => htmlentities($description, ENT_COMPAT, "UTF-8", $double_encode = false),
            );
        }
        $result = json_encode($data, JSON_PRETTY_PRINT, 5);
        if (false === $result) {
            $lastError = json_last_error();
            switch ($lastError) {
                case JSON_ERROR_NONE:
                    return 'No error has occurred';
                case JSON_ERROR_DEPTH:
                    return 'The maximum stack depth has been exceeded    ';
                case JSON_ERROR_STATE_MISMATCH:
                    return 'Invalid or malformed JSON';
                case JSON_ERROR_CTRL_CHAR:
                    return 'Control character error, possibly incorrectly encoded';
                case JSON_ERROR_SYNTAX:
                    return 'Syntax error';
                case JSON_ERROR_UTF8:
                    return 'Malformed UTF-8 characters, possibly incorrectly encoded';
                case JSON_ERROR_RECURSION:
                    return 'One or more recursive references in the value to be encoded';
                case JSON_ERROR_INF_OR_NAN:
                    return 'One or more NAN or INF values in the value to be encoded';
                case JSON_ERROR_UNSUPPORTED_TYPE:
                    return 'A value of a type that cannot be encoded was given';
                default:
                    return "Error #:" . $lastError;
            }
        }
        return $result;
    }
}
