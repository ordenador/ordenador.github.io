// Registro de variantes de CV personalizadas. Taxonomía: conceptos genéricos
// (nunca el nombre de una empresa). Cada variante se renderiza con ?cv=<slug>
// y su PDF se publica en /cv/<slug>.pdf — URLs no listadas en el sitio.
import { resumeData as iaAplicada } from './ia-aplicada';

export const variants = {
  'ia-aplicada': { locale: 'es', data: iaAplicada },
};
