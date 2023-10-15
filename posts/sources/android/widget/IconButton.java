package android.widget;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.TextView;
import com.joanzapata.android.iconify.Iconify;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class IconButton extends Button {
    public IconButton(Context context) {
        super(context);
        init();
    }

    private void init() {
        if (!isInEditMode()) {
            Iconify.addIcons(this);
        } else {
            setText(getText());
        }
    }

    @Override // android.widget.TextView
    public void setText(CharSequence charSequence, TextView.BufferType bufferType) {
        super.setText(Iconify.compute(charSequence), bufferType);
    }

    public IconButton(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
        init();
    }

    public IconButton(Context context, AttributeSet attributeSet, int i) {
        super(context, attributeSet, i);
        init();
    }
}
