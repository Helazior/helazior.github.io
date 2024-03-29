package com.google.firebase.installations;

import com.google.android.gms.tasks.TaskCompletionSource;
import com.google.firebase.installations.local.PersistedInstallationEntry;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class GetAuthTokenListener implements StateListener {
    private final TaskCompletionSource<InstallationTokenResult> resultTaskCompletionSource;
    private final Utils utils;

    public GetAuthTokenListener(Utils utils, TaskCompletionSource<InstallationTokenResult> taskCompletionSource) {
        this.utils = utils;
        this.resultTaskCompletionSource = taskCompletionSource;
    }

    @Override // com.google.firebase.installations.StateListener
    public boolean onException(Exception exc) {
        this.resultTaskCompletionSource.trySetException(exc);
        return true;
    }

    @Override // com.google.firebase.installations.StateListener
    public boolean onStateReached(PersistedInstallationEntry persistedInstallationEntry) {
        if (!persistedInstallationEntry.isRegistered() || this.utils.isAuthTokenExpired(persistedInstallationEntry)) {
            return false;
        }
        this.resultTaskCompletionSource.setResult(InstallationTokenResult.builder().setToken(persistedInstallationEntry.getAuthToken()).setTokenExpirationTimestamp(persistedInstallationEntry.getExpiresInSecs()).setTokenCreationTimestamp(persistedInstallationEntry.getTokenCreationEpochInSecs()).build());
        return true;
    }
}
