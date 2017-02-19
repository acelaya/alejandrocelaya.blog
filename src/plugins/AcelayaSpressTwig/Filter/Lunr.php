<?php
namespace Acelaya\SpressPlugin\AcelayaSpressTwig\Filter;

class Lunr
{
    const NAME = 'lunr';

    /**
     * @param array $posts
     * @return string
     */
    public function __invoke(array $posts)
    {
        $data = ['entries' => []];
        foreach ($posts as $post) {
            if ($post['output'] === false) {
                continue;
            }

            $content = $this->compactFilter(strip_tags($post['content']));
            $description = substr(strip_tags($content), 0, 280);
            $data['entries'][] = [
                'title' => $this->compactFilter(strip_tags($post['title'])),
                'url' => $post['url'],
                'date' => \DateTime::createFromFormat('Y-m-d\TH:i:sO', $post['mtime'])->format('Y-m-d H:i:s O'),
                'body' => htmlentities($content, ENT_COMPAT, 'UTF-8', $double_encode = false),
                'description' => trim(htmlentities($description, ENT_COMPAT, 'UTF-8', $double_encode = false)) . '...',
            ];
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
                    return 'Error #:' . $lastError;
            }
        }
        return $result;
    }

    protected function compactFilter($string)
    {
        return trim(preg_replace('!\s+!isU', ' ', $string));
    }
}
