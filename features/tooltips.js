($ => {
    'use strict';
    
    $(() => {
        const $tooltips = $('[data-toggle="tooltip"], .colorPreview, #restore');

        $tooltips.each((i, e) => {
            let $this = $(e);

            if ($this.is('.colorPreview:not(#colPicker)')) {
                $this.attr('title', 'Color preview (click for rainbow)');
            } else if ($this.is('#colPicker')) {
                $this.attr('title', 'Color picker');
            } else if ($this.is('.containerColorbox')) {
                $this.attr('title', 'Select a color (0-9)');
            } else if ($this.is('.containerBrushSizes')) {
                $this.attr('title', 'Set brush size (1-4)');
            } else if ($this.is('#buttonClearCanvas')) {
                $this.attr('title', 'Clear the board (ESC)');
            } else if ($this.is('#restore')) {
                $this.attr('title', 'Undo (Ctrl+Z)');
            }

            if ($this.is('.toolIcon')) {
                $this.parent().attr('title', $this.attr('title'));
                $this.removeAttr('title');
                $this = $this.parent();
            }
            $this.css('cursor', 'pointer');
            $this.attr('data-placement', 'bottom');
            $this.tooltip({ container: 'body' });
        });

        $('.ui-helper-hidden-accessible').remove();
    });
})(jQuery);
