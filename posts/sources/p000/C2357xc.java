package p000;

import android.util.SparseIntArray;
import android.widget.ScrollView;
import androidx.constraintlayout.widget.ConstraintLayout;

/* renamed from: xc */
/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class C2356xc extends AbstractC2333wc {

    /* renamed from: g */
    public static final SparseIntArray f6842g;

    /* renamed from: c */
    public final ScrollView f6843c;

    /* renamed from: d */
    public final ConstraintLayout f6844d;

    /* renamed from: f */
    public long f6845f;

    static {
        SparseIntArray sparseIntArray = new SparseIntArray();
        f6842g = sparseIntArray;
        sparseIntArray.put(2131296917, 2);
        sparseIntArray.put(2131297023, 3);
    }

    /* JADX WARN: Illegal instructions before constructor call */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct code enable 'Show inconsistent code' option in preferences
    */
    public C2356xc(androidx.databinding.DataBindingComponent r10, android.view.View r11) {
        /*
            r9 = this;
            android.util.SparseIntArray r0 = p000.C2356xc.f6842g
            r1 = 4
            r2 = 0
            java.lang.Object[] r0 = androidx.databinding.ViewDataBinding.mapBindings(r10, r11, r1, r2, r0)
            r1 = 2
            r1 = r0[r1]
            r7 = r1
            android.view.View r7 = (android.view.View) r7
            r1 = 3
            r1 = r0[r1]
            r8 = r1
            android.widget.TextView r8 = (android.widget.TextView) r8
            r6 = 0
            r3 = r9
            r4 = r10
            r5 = r11
            r3.<init>(r4, r5, r6, r7, r8)
            r3 = -1
            r9.f6845f = r3
            r10 = 0
            r10 = r0[r10]
            android.widget.ScrollView r10 = (android.widget.ScrollView) r10
            r9.f6843c = r10
            r10.setTag(r2)
            r10 = 1
            r10 = r0[r10]
            androidx.constraintlayout.widget.ConstraintLayout r10 = (androidx.constraintlayout.widget.ConstraintLayout) r10
            r9.f6844d = r10
            r10.setTag(r2)
            r9.setRootTag(r11)
            r9.invalidateAll()
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: p000.C2356xc.<init>(androidx.databinding.DataBindingComponent, android.view.View):void");
    }

    @Override // androidx.databinding.ViewDataBinding
    public void executeBindings() {
        synchronized (this) {
            this.f6845f = 0L;
        }
    }

    @Override // androidx.databinding.ViewDataBinding
    public boolean hasPendingBindings() {
        synchronized (this) {
            return this.f6845f != 0;
        }
    }

    @Override // androidx.databinding.ViewDataBinding
    public void invalidateAll() {
        synchronized (this) {
            this.f6845f = 1L;
        }
        requestRebind();
    }

    @Override // androidx.databinding.ViewDataBinding
    public boolean onFieldChange(int i, Object obj, int i2) {
        return false;
    }

    @Override // androidx.databinding.ViewDataBinding
    public boolean setVariable(int i, Object obj) {
        return true;
    }
}
