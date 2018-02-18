<?php
namespace Acelaya\SpressPlugin\AcelayaSpressTwig;

use Acelaya\SpressPlugin\AcelayaSpressTwig\Filter\Lunr;
use Acelaya\SpressPlugin\AcelayaSpressTwig\Filter\TruncateHtml;
use Yosymfony\Spress\Core\ContentManager\Renderizer\TwigRenderizer;
use Yosymfony\Spress\Core\Plugin\Event\EnvironmentEvent;
use Yosymfony\Spress\Core\Plugin\EventSubscriber;
use Yosymfony\Spress\Core\Plugin\PluginInterface;

class AcelayaSpressTwig implements PluginInterface
{
    private $io;

    public function initialize(EventSubscriber $subscriber)
    {
        $subscriber->addEventListener('spress.start', 'onStart');
    }

    public function getMetas()
    {
        return [
            'name' => 'acelaya/spress-twig',
            'description' => 'Provides twig extensions for spress blog',
            'author' => 'Alejandro Celaya',
            'license' => 'MIT',
        ];
    }
    
    public function onStart(EnvironmentEvent $event)
    {
        $this->io = $event->getIO();

        /** @var TwigRenderizer $renderizer */
        $renderizer = $event->getRenderizer();
        $renderizer->addTwigFunction(Lunr::NAME, new Lunr(), ['is_safe' => ['html']]);
        $renderizer->addTwigFilter(TruncateHtml::NAME, new TruncateHtml(), ['is_safe' => ['html']]);
        $renderizer->addTwigFunction('dump', function () {
            $values = func_get_args();
            var_dump(...$values);
        }, ['is_safe' => ['html']]);
    }
}
