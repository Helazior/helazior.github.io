package com.bumptech.glide.provider;

import com.bumptech.glide.load.engine.DecodePath;
import com.bumptech.glide.load.engine.LoadPath;
import com.bumptech.glide.load.resource.transcode.UnitTranscoder;
import com.bumptech.glide.util.MultiClassKey;
import java.util.Collections;
import java.util.concurrent.atomic.AtomicReference;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class LoadPathCache {
    private static final LoadPath<?, ?, ?> NO_PATHS_SIGNAL = new LoadPath<>(Object.class, Object.class, Object.class, Collections.singletonList(new DecodePath(Object.class, Object.class, Object.class, Collections.emptyList(), new UnitTranscoder(), null)), null);
    private final C2339x1<MultiClassKey, LoadPath<?, ?, ?>> cache = new C2339x1<>();
    private final AtomicReference<MultiClassKey> keyRef = new AtomicReference<>();

    private MultiClassKey getKey(Class<?> cls, Class<?> cls2, Class<?> cls3) {
        MultiClassKey andSet = this.keyRef.getAndSet(null);
        if (andSet == null) {
            andSet = new MultiClassKey();
        }
        andSet.set(cls, cls2, cls3);
        return andSet;
    }

    public <Data, TResource, Transcode> LoadPath<Data, TResource, Transcode> get(Class<Data> cls, Class<TResource> cls2, Class<Transcode> cls3) {
        LoadPath<Data, TResource, Transcode> loadPath;
        MultiClassKey key = getKey(cls, cls2, cls3);
        synchronized (this.cache) {
            loadPath = (LoadPath<Data, TResource, Transcode>) this.cache.get(key);
        }
        this.keyRef.set(key);
        return loadPath;
    }

    public boolean isEmptyLoadPath(LoadPath<?, ?, ?> loadPath) {
        return NO_PATHS_SIGNAL.equals(loadPath);
    }

    public void put(Class<?> cls, Class<?> cls2, Class<?> cls3, LoadPath<?, ?, ?> loadPath) {
        synchronized (this.cache) {
            C2339x1<MultiClassKey, LoadPath<?, ?, ?>> c2339x1 = this.cache;
            MultiClassKey multiClassKey = new MultiClassKey(cls, cls2, cls3);
            if (loadPath == null) {
                loadPath = NO_PATHS_SIGNAL;
            }
            c2339x1.put(multiClassKey, loadPath);
        }
    }
}
