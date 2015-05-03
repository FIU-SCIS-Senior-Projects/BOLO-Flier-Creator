<html>
<script>
$(document).ready(function() {
    $('#dob').formValidation({
        framework: 'bootstrap',
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
          dob: {
                validators: {
                    date: {
                        format: 'YYYY/MM/DD',
                        message: 'The value is not a valid date'
                    }
                }
            }
        }
    });
});
</script>

</html>