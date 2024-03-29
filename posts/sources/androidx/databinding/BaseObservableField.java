package androidx.databinding;

import androidx.databinding.Observable;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public abstract class BaseObservableField extends BaseObservable {

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public class DependencyCallback extends Observable.OnPropertyChangedCallback {
        public DependencyCallback() {
        }

        @Override // androidx.databinding.Observable.OnPropertyChangedCallback
        public void onPropertyChanged(Observable observable, int i) {
            BaseObservableField.this.notifyChange();
        }
    }

    public BaseObservableField() {
    }

    public BaseObservableField(Observable... observableArr) {
        if (observableArr == null || observableArr.length == 0) {
            return;
        }
        DependencyCallback dependencyCallback = new DependencyCallback();
        for (Observable observable : observableArr) {
            observable.addOnPropertyChangedCallback(dependencyCallback);
        }
    }
}
