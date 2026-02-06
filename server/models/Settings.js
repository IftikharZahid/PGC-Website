import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    key: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Static method to get a setting by key
SettingsSchema.statics.getSetting = async function (key, defaultValue = null) {
    const setting = await this.findOne({ key });
    return setting ? setting.value : defaultValue;
};

// Static method to set a setting
SettingsSchema.statics.setSetting = async function (key, value) {
    const result = await this.findOneAndUpdate(
        { key },
        { key, value, updatedAt: new Date() },
        { upsert: true, new: true }
    );
    return result;
};

// Static method to get all settings as an object
SettingsSchema.statics.getAllSettings = async function () {
    const settings = await this.find({});
    const result = {};
    settings.forEach(s => {
        result[s.key] = s.value;
    });
    return result;
};

const Settings = mongoose.model('Settings', SettingsSchema);

export default Settings;
