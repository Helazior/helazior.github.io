package com.google.firebase.crashlytics.internal.log;

import com.bumptech.glide.load.Key;
import com.google.firebase.crashlytics.internal.Logger;
import com.google.firebase.crashlytics.internal.common.CommonUtils;
import com.google.firebase.crashlytics.internal.log.QueueFile;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.Locale;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class QueueFileLogStore implements FileLogStore {
    private static final Charset UTF_8 = Charset.forName(Key.STRING_CHARSET_NAME);
    private QueueFile logFile;
    private final int maxLogSize;
    private final File workingFile;

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static class LogBytes {
        public final byte[] bytes;
        public final int offset;

        public LogBytes(byte[] bArr, int i) {
            this.bytes = bArr;
            this.offset = i;
        }
    }

    public QueueFileLogStore(File file, int i) {
        this.workingFile = file;
        this.maxLogSize = i;
    }

    private void doWriteToLog(long j, String str) {
        int i;
        if (this.logFile == null) {
            return;
        }
        if (str == null) {
            str = "null";
        }
        try {
            if (str.length() > this.maxLogSize / 4) {
                str = "..." + str.substring(str.length() - i);
            }
            this.logFile.add(String.format(Locale.US, "%d %s%n", Long.valueOf(j), str.replaceAll("\r", " ").replaceAll("\n", " ")).getBytes(UTF_8));
            while (!this.logFile.isEmpty() && this.logFile.usedBytes() > this.maxLogSize) {
                this.logFile.remove();
            }
        } catch (IOException e) {
            Logger.getLogger().m1081e("There was a problem writing to the Crashlytics log.", e);
        }
    }

    private LogBytes getLogBytes() {
        if (this.workingFile.exists()) {
            openLogFile();
            QueueFile queueFile = this.logFile;
            if (queueFile == null) {
                return null;
            }
            final int[] iArr = {0};
            final byte[] bArr = new byte[queueFile.usedBytes()];
            try {
                this.logFile.forEach(new QueueFile.ElementReader() { // from class: com.google.firebase.crashlytics.internal.log.QueueFileLogStore.1
                    @Override // com.google.firebase.crashlytics.internal.log.QueueFile.ElementReader
                    public void read(InputStream inputStream, int i) {
                        try {
                            inputStream.read(bArr, iArr[0], i);
                            int[] iArr2 = iArr;
                            iArr2[0] = iArr2[0] + i;
                        } finally {
                            inputStream.close();
                        }
                    }
                });
            } catch (IOException e) {
                Logger.getLogger().m1081e("A problem occurred while reading the Crashlytics log file.", e);
            }
            return new LogBytes(bArr, iArr[0]);
        }
        return null;
    }

    private void openLogFile() {
        if (this.logFile == null) {
            try {
                this.logFile = new QueueFile(this.workingFile);
            } catch (IOException e) {
                Logger logger = Logger.getLogger();
                StringBuilder m253r = outline.m253r("Could not open log file: ");
                m253r.append(this.workingFile);
                logger.m1081e(m253r.toString(), e);
            }
        }
    }

    @Override // com.google.firebase.crashlytics.internal.log.FileLogStore
    public void closeLogFile() {
        CommonUtils.closeOrLog(this.logFile, "There was a problem closing the Crashlytics log file.");
        this.logFile = null;
    }

    @Override // com.google.firebase.crashlytics.internal.log.FileLogStore
    public void deleteLogFile() {
        closeLogFile();
        this.workingFile.delete();
    }

    @Override // com.google.firebase.crashlytics.internal.log.FileLogStore
    public byte[] getLogAsBytes() {
        LogBytes logBytes = getLogBytes();
        if (logBytes == null) {
            return null;
        }
        int i = logBytes.offset;
        byte[] bArr = new byte[i];
        System.arraycopy(logBytes.bytes, 0, bArr, 0, i);
        return bArr;
    }

    @Override // com.google.firebase.crashlytics.internal.log.FileLogStore
    public String getLogAsString() {
        byte[] logAsBytes = getLogAsBytes();
        if (logAsBytes != null) {
            return new String(logAsBytes, UTF_8);
        }
        return null;
    }

    @Override // com.google.firebase.crashlytics.internal.log.FileLogStore
    public void writeToLog(long j, String str) {
        openLogFile();
        doWriteToLog(j, str);
    }
}
