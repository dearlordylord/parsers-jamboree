import { FEATURES_DESCRIPTIONS } from '../index';

export const FeaturesAbstractList = () => <ul className="list-disc list-inside">
  <li>Any basic features you’d expect from a validator: “This string is a string, this object has fields I expect…”</li>
  {Object.entries(FEATURES_DESCRIPTIONS).map(([k, v]) => (
    <li key={k}>{v.short}</li>
  ))}
  <li>Importantly, any of those features in combination with each other</li>
</ul>
