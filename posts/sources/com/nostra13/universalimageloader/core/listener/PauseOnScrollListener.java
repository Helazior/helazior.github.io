package com.nostra13.universalimageloader.core.listener;

import android.widget.AbsListView;
import com.nostra13.universalimageloader.core.ImageLoader;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class PauseOnScrollListener implements AbsListView.OnScrollListener {
    private final AbsListView.OnScrollListener externalListener;
    private ImageLoader imageLoader;
    private final boolean pauseOnFling;
    private final boolean pauseOnScroll;

    public PauseOnScrollListener(ImageLoader imageLoader, boolean z, boolean z2) {
        this(imageLoader, z, z2, null);
    }

    @Override // android.widget.AbsListView.OnScrollListener
    public void onScroll(AbsListView absListView, int i, int i2, int i3) {
        AbsListView.OnScrollListener onScrollListener = this.externalListener;
        if (onScrollListener != null) {
            onScrollListener.onScroll(absListView, i, i2, i3);
        }
    }

    @Override // android.widget.AbsListView.OnScrollListener
    public void onScrollStateChanged(AbsListView absListView, int i) {
        if (i == 0) {
            this.imageLoader.resume();
        } else if (i != 1) {
            if (i == 2 && this.pauseOnFling) {
                this.imageLoader.pause();
            }
        } else if (this.pauseOnScroll) {
            this.imageLoader.pause();
        }
        AbsListView.OnScrollListener onScrollListener = this.externalListener;
        if (onScrollListener != null) {
            onScrollListener.onScrollStateChanged(absListView, i);
        }
    }

    public PauseOnScrollListener(ImageLoader imageLoader, boolean z, boolean z2, AbsListView.OnScrollListener onScrollListener) {
        this.imageLoader = imageLoader;
        this.pauseOnScroll = z;
        this.pauseOnFling = z2;
        this.externalListener = onScrollListener;
    }
}
