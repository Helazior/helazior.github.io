package androidx.databinding.adapters;

import android.widget.DatePicker;
import androidx.databinding.BindingAdapter;
import androidx.databinding.InverseBindingListener;
import androidx.databinding.InverseBindingMethod;
import androidx.databinding.InverseBindingMethods;
import androidx.databinding.library.baseAdapters.C0790R;

@InverseBindingMethods({@InverseBindingMethod(attribute = "android:year", type = DatePicker.class), @InverseBindingMethod(attribute = "android:month", type = DatePicker.class), @InverseBindingMethod(attribute = "android:day", method = "getDayOfMonth", type = DatePicker.class)})
/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class DatePickerBindingAdapter {

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static class DateChangedListener implements DatePicker.OnDateChangedListener {
        public InverseBindingListener mDayChanged;
        public DatePicker.OnDateChangedListener mListener;
        public InverseBindingListener mMonthChanged;
        public InverseBindingListener mYearChanged;

        private DateChangedListener() {
        }

        @Override // android.widget.DatePicker.OnDateChangedListener
        public void onDateChanged(DatePicker datePicker, int i, int i2, int i3) {
            DatePicker.OnDateChangedListener onDateChangedListener = this.mListener;
            if (onDateChangedListener != null) {
                onDateChangedListener.onDateChanged(datePicker, i, i2, i3);
            }
            InverseBindingListener inverseBindingListener = this.mYearChanged;
            if (inverseBindingListener != null) {
                inverseBindingListener.onChange();
            }
            InverseBindingListener inverseBindingListener2 = this.mMonthChanged;
            if (inverseBindingListener2 != null) {
                inverseBindingListener2.onChange();
            }
            InverseBindingListener inverseBindingListener3 = this.mDayChanged;
            if (inverseBindingListener3 != null) {
                inverseBindingListener3.onChange();
            }
        }

        public void setListeners(DatePicker.OnDateChangedListener onDateChangedListener, InverseBindingListener inverseBindingListener, InverseBindingListener inverseBindingListener2, InverseBindingListener inverseBindingListener3) {
            this.mListener = onDateChangedListener;
            this.mYearChanged = inverseBindingListener;
            this.mMonthChanged = inverseBindingListener2;
            this.mDayChanged = inverseBindingListener3;
        }
    }

    @BindingAdapter(requireAll = false, value = {"android:year", "android:month", "android:day", "android:onDateChanged", "android:yearAttrChanged", "android:monthAttrChanged", "android:dayAttrChanged"})
    public static void setListeners(DatePicker datePicker, int i, int i2, int i3, DatePicker.OnDateChangedListener onDateChangedListener, InverseBindingListener inverseBindingListener, InverseBindingListener inverseBindingListener2, InverseBindingListener inverseBindingListener3) {
        if (i == 0) {
            i = datePicker.getYear();
        }
        if (i3 == 0) {
            i3 = datePicker.getDayOfMonth();
        }
        if (inverseBindingListener == null && inverseBindingListener2 == null && inverseBindingListener3 == null) {
            datePicker.init(i, i2, i3, onDateChangedListener);
            return;
        }
        int i4 = C0790R.C0793id.onDateChanged;
        DateChangedListener dateChangedListener = (DateChangedListener) ListenerUtil.getListener(datePicker, i4);
        if (dateChangedListener == null) {
            dateChangedListener = new DateChangedListener();
            ListenerUtil.trackListener(datePicker, dateChangedListener, i4);
        }
        dateChangedListener.setListeners(onDateChangedListener, inverseBindingListener, inverseBindingListener2, inverseBindingListener3);
        datePicker.init(i, i2, i3, dateChangedListener);
    }
}
