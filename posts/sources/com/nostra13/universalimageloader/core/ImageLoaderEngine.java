package com.nostra13.universalimageloader.core;

import com.nostra13.universalimageloader.core.imageaware.ImageAware;
import java.io.File;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.WeakHashMap;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.locks.ReentrantLock;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class ImageLoaderEngine {
    public final ImageLoaderConfiguration configuration;
    private Executor taskExecutor;
    private Executor taskExecutorForCachedImages;
    private final Map<Integer, String> cacheKeysForImageAwares = Collections.synchronizedMap(new HashMap());
    private final Map<String, ReentrantLock> uriLocks = new WeakHashMap();
    private final AtomicBoolean paused = new AtomicBoolean(false);
    private final AtomicBoolean networkDenied = new AtomicBoolean(false);
    private final AtomicBoolean slowNetwork = new AtomicBoolean(false);
    private final Object pauseLock = new Object();
    private Executor taskDistributor = DefaultConfigurationFactory.createTaskDistributor();

    public ImageLoaderEngine(ImageLoaderConfiguration imageLoaderConfiguration) {
        this.configuration = imageLoaderConfiguration;
        this.taskExecutor = imageLoaderConfiguration.taskExecutor;
        this.taskExecutorForCachedImages = imageLoaderConfiguration.taskExecutorForCachedImages;
    }

    private Executor createTaskExecutor() {
        ImageLoaderConfiguration imageLoaderConfiguration = this.configuration;
        return DefaultConfigurationFactory.createExecutor(imageLoaderConfiguration.threadPoolSize, imageLoaderConfiguration.threadPriority, imageLoaderConfiguration.tasksProcessingType);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void initExecutorsIfNeed() {
        if (!this.configuration.customExecutor && ((ExecutorService) this.taskExecutor).isShutdown()) {
            this.taskExecutor = createTaskExecutor();
        }
        if (this.configuration.customExecutorForCachedImages || !((ExecutorService) this.taskExecutorForCachedImages).isShutdown()) {
            return;
        }
        this.taskExecutorForCachedImages = createTaskExecutor();
    }

    public void cancelDisplayTaskFor(ImageAware imageAware) {
        this.cacheKeysForImageAwares.remove(Integer.valueOf(imageAware.getId()));
    }

    public void denyNetworkDownloads(boolean z) {
        this.networkDenied.set(z);
    }

    public void fireCallback(Runnable runnable) {
        this.taskDistributor.execute(runnable);
    }

    public String getLoadingUriForView(ImageAware imageAware) {
        return this.cacheKeysForImageAwares.get(Integer.valueOf(imageAware.getId()));
    }

    public ReentrantLock getLockForUri(String str) {
        ReentrantLock reentrantLock = this.uriLocks.get(str);
        if (reentrantLock == null) {
            ReentrantLock reentrantLock2 = new ReentrantLock();
            this.uriLocks.put(str, reentrantLock2);
            return reentrantLock2;
        }
        return reentrantLock;
    }

    public AtomicBoolean getPause() {
        return this.paused;
    }

    public Object getPauseLock() {
        return this.pauseLock;
    }

    public void handleSlowNetwork(boolean z) {
        this.slowNetwork.set(z);
    }

    public boolean isNetworkDenied() {
        return this.networkDenied.get();
    }

    public boolean isSlowNetwork() {
        return this.slowNetwork.get();
    }

    public void pause() {
        this.paused.set(true);
    }

    public void prepareDisplayTaskFor(ImageAware imageAware, String str) {
        this.cacheKeysForImageAwares.put(Integer.valueOf(imageAware.getId()), str);
    }

    public void resume() {
        this.paused.set(false);
        synchronized (this.pauseLock) {
            this.pauseLock.notifyAll();
        }
    }

    public void stop() {
        if (!this.configuration.customExecutor) {
            ((ExecutorService) this.taskExecutor).shutdownNow();
        }
        if (!this.configuration.customExecutorForCachedImages) {
            ((ExecutorService) this.taskExecutorForCachedImages).shutdownNow();
        }
        this.cacheKeysForImageAwares.clear();
        this.uriLocks.clear();
    }

    public void submit(final LoadAndDisplayImageTask loadAndDisplayImageTask) {
        this.taskDistributor.execute(new Runnable() { // from class: com.nostra13.universalimageloader.core.ImageLoaderEngine.1
            @Override // java.lang.Runnable
            public void run() {
                File file = ImageLoaderEngine.this.configuration.diskCache.get(loadAndDisplayImageTask.getLoadingUri());
                boolean z = file != null && file.exists();
                ImageLoaderEngine.this.initExecutorsIfNeed();
                if (z) {
                    ImageLoaderEngine.this.taskExecutorForCachedImages.execute(loadAndDisplayImageTask);
                } else {
                    ImageLoaderEngine.this.taskExecutor.execute(loadAndDisplayImageTask);
                }
            }
        });
    }

    public void submit(ProcessAndDisplayImageTask processAndDisplayImageTask) {
        initExecutorsIfNeed();
        this.taskExecutorForCachedImages.execute(processAndDisplayImageTask);
    }
}
