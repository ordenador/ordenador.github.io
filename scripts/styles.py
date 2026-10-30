"""Additional export rules. Typography and layout share the site's print CSS."""


def get_pdf_styles():
    return """
      @media print {
        .career-history summary { display: none !important; }
        .career-history > .earlier-experience { display: block !important; }
      }
    """
