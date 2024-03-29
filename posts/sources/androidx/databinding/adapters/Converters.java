package androidx.databinding.adapters;

import android.content.res.ColorStateList;
import android.graphics.drawable.ColorDrawable;
import androidx.databinding.BindingConversion;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class Converters {
    @BindingConversion
    public static ColorStateList convertColorToColorStateList(int i) {
        return ColorStateList.valueOf(i);
    }

    @BindingConversion
    public static ColorDrawable convertColorToDrawable(int i) {
        return new ColorDrawable(i);
    }
}
