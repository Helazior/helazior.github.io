package com.google.firebase.crashlytics.internal.common;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.firebase.FirebaseApp;
import com.google.firebase.crashlytics.BuildConfig;
import com.google.firebase.crashlytics.internal.CrashlyticsNativeComponent;
import com.google.firebase.crashlytics.internal.Logger;
import com.google.firebase.crashlytics.internal.analytics.AnalyticsEventLogger;
import com.google.firebase.crashlytics.internal.breadcrumbs.BreadcrumbSource;
import com.google.firebase.crashlytics.internal.log.LogFileManager;
import com.google.firebase.crashlytics.internal.persistence.FileStore;
import com.google.firebase.crashlytics.internal.persistence.FileStoreImpl;
import com.google.firebase.crashlytics.internal.settings.SettingsDataProvider;
import com.google.firebase.crashlytics.internal.stacktrace.MiddleOutFallbackStrategy;
import com.google.firebase.crashlytics.internal.stacktrace.RemoveRepeatsStrategy;
import java.io.File;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class CrashlyticsCore {
    public static final String CRASHLYTICS_REQUIRE_BUILD_ID = "com.crashlytics.RequireBuildId";
    public static final boolean CRASHLYTICS_REQUIRE_BUILD_ID_DEFAULT = true;
    public static final String CRASH_MARKER_FILE_NAME = "crash_marker";
    public static final int DEFAULT_MAIN_HANDLER_TIMEOUT_SEC = 4;
    private static final String INITIALIZATION_MARKER_FILE_NAME = "initialization_marker";
    public static final int MAX_STACK_SIZE = 1024;
    private static final String MISSING_BUILD_ID_MSG = "The Crashlytics build ID is missing. This occurs when Crashlytics tooling is absent from your app's build configuration. Please review Crashlytics onboarding instructions and ensure you have a valid Crashlytics account.";
    public static final int NUM_STACK_REPETITIONS_ALLOWED = 10;
    private final AnalyticsEventLogger analyticsEventLogger;
    private final FirebaseApp app;
    private final CrashlyticsBackgroundWorker backgroundWorker;
    private final BreadcrumbSource breadcrumbSource;
    private final Context context;
    private CrashlyticsController controller;
    private final ExecutorService crashHandlerExecutor;
    private CrashlyticsFileMarker crashMarker;
    private final DataCollectionArbiter dataCollectionArbiter;
    private boolean didCrashOnPreviousExecution;
    private final IdManager idManager;
    private CrashlyticsFileMarker initializationMarker;
    private final CrashlyticsNativeComponent nativeComponent;
    private final long startTime = System.currentTimeMillis();

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static final class LogFileDirectoryProvider implements LogFileManager.DirectoryProvider {
        private static final String LOG_FILES_DIR = "log-files";
        private final FileStore rootFileStore;

        public LogFileDirectoryProvider(FileStore fileStore) {
            this.rootFileStore = fileStore;
        }

        @Override // com.google.firebase.crashlytics.internal.log.LogFileManager.DirectoryProvider
        public File getLogFileDir() {
            File file = new File(this.rootFileStore.getFilesDir(), LOG_FILES_DIR);
            if (!file.exists()) {
                file.mkdirs();
            }
            return file;
        }
    }

    public CrashlyticsCore(FirebaseApp firebaseApp, IdManager idManager, CrashlyticsNativeComponent crashlyticsNativeComponent, DataCollectionArbiter dataCollectionArbiter, BreadcrumbSource breadcrumbSource, AnalyticsEventLogger analyticsEventLogger, ExecutorService executorService) {
        this.app = firebaseApp;
        this.dataCollectionArbiter = dataCollectionArbiter;
        this.context = firebaseApp.getApplicationContext();
        this.idManager = idManager;
        this.nativeComponent = crashlyticsNativeComponent;
        this.breadcrumbSource = breadcrumbSource;
        this.analyticsEventLogger = analyticsEventLogger;
        this.crashHandlerExecutor = executorService;
        this.backgroundWorker = new CrashlyticsBackgroundWorker(executorService);
    }

    private void checkForPreviousCrash() {
        try {
            this.didCrashOnPreviousExecution = Boolean.TRUE.equals((Boolean) Utils.awaitEvenIfOnMainThread(this.backgroundWorker.submit(new Callable<Boolean>() { // from class: com.google.firebase.crashlytics.internal.common.CrashlyticsCore.4
                /* JADX WARN: Can't rename method to resolve collision */
                @Override // java.util.concurrent.Callable
                public Boolean call() {
                    return Boolean.valueOf(CrashlyticsCore.this.controller.didCrashOnPreviousExecution());
                }
            })));
        } catch (Exception unused) {
            this.didCrashOnPreviousExecution = false;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public Task<Void> doBackgroundInitialization(SettingsDataProvider settingsDataProvider) {
        markInitializationStarted();
        try {
            this.breadcrumbSource.registerBreadcrumbHandler(CrashlyticsCore$$Lambda$1.lambdaFactory$(this));
            if (!settingsDataProvider.getSettings().getFeaturesData().collectReports) {
                Logger.getLogger().m1084d("Collection of crash reports disabled in Crashlytics settings.");
                return Tasks.forException(new RuntimeException("Collection of crash reports disabled in Crashlytics settings."));
            }
            if (!this.controller.finalizeSessions()) {
                Logger.getLogger().m1076w("Previous sessions could not be finalized.");
            }
            return this.controller.submitAllReports(settingsDataProvider.getAppSettings());
        } catch (Exception e) {
            Logger.getLogger().m1081e("Crashlytics encountered a problem during asynchronous initialization.", e);
            return Tasks.forException(e);
        } finally {
            markInitializationComplete();
        }
    }

    private void finishInitSynchronously(final SettingsDataProvider settingsDataProvider) {
        Future<?> submit = this.crashHandlerExecutor.submit(new Runnable() { // from class: com.google.firebase.crashlytics.internal.common.CrashlyticsCore.2
            @Override // java.lang.Runnable
            public void run() {
                CrashlyticsCore.this.doBackgroundInitialization(settingsDataProvider);
            }
        });
        Logger.getLogger().m1084d("Crashlytics detected incomplete initialization on previous app launch. Will initialize synchronously.");
        try {
            submit.get(4L, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Logger.getLogger().m1081e("Crashlytics was interrupted during initialization.", e);
        } catch (ExecutionException e2) {
            Logger.getLogger().m1081e("Crashlytics encountered a problem during initialization.", e2);
        } catch (TimeoutException e3) {
            Logger.getLogger().m1081e("Crashlytics timed out during initialization.", e3);
        }
    }

    public static String getVersion() {
        return BuildConfig.VERSION_NAME;
    }

    public static boolean isBuildIdValid(String str, boolean z) {
        if (!z) {
            Logger.getLogger().m1078v("Configured not to require a build ID.");
            return true;
        } else if (TextUtils.isEmpty(str)) {
            Log.e(Logger.TAG, ".");
            Log.e(Logger.TAG, ".     |  | ");
            Log.e(Logger.TAG, ".     |  |");
            Log.e(Logger.TAG, ".     |  |");
            Log.e(Logger.TAG, ".   \\ |  | /");
            Log.e(Logger.TAG, ".    \\    /");
            Log.e(Logger.TAG, ".     \\  /");
            Log.e(Logger.TAG, ".      \\/");
            Log.e(Logger.TAG, ".");
            Log.e(Logger.TAG, MISSING_BUILD_ID_MSG);
            Log.e(Logger.TAG, ".");
            Log.e(Logger.TAG, ".      /\\");
            Log.e(Logger.TAG, ".     /  \\");
            Log.e(Logger.TAG, ".    /    \\");
            Log.e(Logger.TAG, ".   / |  | \\");
            Log.e(Logger.TAG, ".     |  |");
            Log.e(Logger.TAG, ".     |  |");
            Log.e(Logger.TAG, ".     |  |");
            Log.e(Logger.TAG, ".");
            return false;
        } else {
            return true;
        }
    }

    public Task<Boolean> checkForUnsentReports() {
        return this.controller.checkForUnsentReports();
    }

    public Task<Void> deleteUnsentReports() {
        return this.controller.deleteUnsentReports();
    }

    public boolean didCrashOnPreviousExecution() {
        return this.didCrashOnPreviousExecution;
    }

    public boolean didPreviousInitializationFail() {
        return this.initializationMarker.isPresent();
    }

    public Task<Void> doBackgroundInitializationAsync(final SettingsDataProvider settingsDataProvider) {
        return Utils.callTask(this.crashHandlerExecutor, new Callable<Task<Void>>() { // from class: com.google.firebase.crashlytics.internal.common.CrashlyticsCore.1
            /* JADX WARN: Can't rename method to resolve collision */
            @Override // java.util.concurrent.Callable
            public Task<Void> call() {
                return CrashlyticsCore.this.doBackgroundInitialization(settingsDataProvider);
            }
        });
    }

    public CrashlyticsController getController() {
        return this.controller;
    }

    public void log(String str) {
        this.controller.writeToLog(System.currentTimeMillis() - this.startTime, str);
    }

    public void logException(Throwable th) {
        this.controller.writeNonFatalException(Thread.currentThread(), th);
    }

    public void markInitializationComplete() {
        this.backgroundWorker.submit(new Callable<Boolean>() { // from class: com.google.firebase.crashlytics.internal.common.CrashlyticsCore.3
            /* JADX WARN: Can't rename method to resolve collision */
            @Override // java.util.concurrent.Callable
            public Boolean call() {
                try {
                    boolean remove = CrashlyticsCore.this.initializationMarker.remove();
                    if (!remove) {
                        Logger.getLogger().m1076w("Initialization marker file was not properly removed.");
                    }
                    return Boolean.valueOf(remove);
                } catch (Exception e) {
                    Logger.getLogger().m1081e("Problem encountered deleting Crashlytics initialization marker.", e);
                    return Boolean.FALSE;
                }
            }
        });
    }

    public void markInitializationStarted() {
        this.backgroundWorker.checkRunningOnThread();
        this.initializationMarker.create();
        Logger.getLogger().m1078v("Initialization marker file was created.");
    }

    public boolean onPreExecute(AppData appData, SettingsDataProvider settingsDataProvider) {
        if (isBuildIdValid(appData.buildId, CommonUtils.getBooleanResourceValue(this.context, CRASHLYTICS_REQUIRE_BUILD_ID, true))) {
            try {
                FileStoreImpl fileStoreImpl = new FileStoreImpl(this.context);
                this.crashMarker = new CrashlyticsFileMarker(CRASH_MARKER_FILE_NAME, fileStoreImpl);
                this.initializationMarker = new CrashlyticsFileMarker(INITIALIZATION_MARKER_FILE_NAME, fileStoreImpl);
                UserMetadata userMetadata = new UserMetadata();
                LogFileDirectoryProvider logFileDirectoryProvider = new LogFileDirectoryProvider(fileStoreImpl);
                LogFileManager logFileManager = new LogFileManager(this.context, logFileDirectoryProvider);
                this.controller = new CrashlyticsController(this.context, this.backgroundWorker, this.idManager, this.dataCollectionArbiter, fileStoreImpl, this.crashMarker, appData, userMetadata, logFileManager, logFileDirectoryProvider, SessionReportingCoordinator.create(this.context, this.idManager, fileStoreImpl, appData, logFileManager, userMetadata, new MiddleOutFallbackStrategy(1024, new RemoveRepeatsStrategy(10)), settingsDataProvider), this.nativeComponent, this.analyticsEventLogger);
                boolean didPreviousInitializationFail = didPreviousInitializationFail();
                checkForPreviousCrash();
                this.controller.enableExceptionHandling(Thread.getDefaultUncaughtExceptionHandler(), settingsDataProvider);
                if (didPreviousInitializationFail && CommonUtils.canTryConnection(this.context)) {
                    Logger.getLogger().m1084d("Crashlytics did not finish previous background initialization. Initializing synchronously.");
                    finishInitSynchronously(settingsDataProvider);
                    return false;
                }
                Logger.getLogger().m1084d("Successfully configured exception handler.");
                return true;
            } catch (Exception e) {
                Logger.getLogger().m1081e("Crashlytics was not started due to an exception during initialization", e);
                this.controller = null;
                return false;
            }
        }
        throw new IllegalStateException(MISSING_BUILD_ID_MSG);
    }

    public Task<Void> sendUnsentReports() {
        return this.controller.sendUnsentReports();
    }

    public void setCrashlyticsCollectionEnabled(Boolean bool) {
        this.dataCollectionArbiter.setCrashlyticsDataCollectionEnabled(bool);
    }

    public void setCustomKey(String str, String str2) {
        this.controller.setCustomKey(str, str2);
    }

    public void setCustomKeys(Map<String, String> map) {
        this.controller.setCustomKeys(map);
    }

    public void setUserId(String str) {
        this.controller.setUserId(str);
    }
}
