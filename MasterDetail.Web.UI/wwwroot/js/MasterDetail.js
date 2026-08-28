

$(document).ready(function () {

    console.log("Ready!");
    
    $('#SelectedCategory').change(function () {
        var enumHeaderId = $('option:selected', this).val();
        if (enumHeaderId === "0") {
            $("#addEnumDetail").css('visibility', 'hidden');
        }
        else {
            $("#addEnumDetail").css('visibility', 'visible');
        }
        var url = getDomainUrl() + '/MasterDetail/?id=' + enumHeaderId + '&handler=ShowDetail';
        $('#detailDiv').mask("waiting ...");
        $('#detailDiv').load(url, function (response, status, xhr) {
            $('#detailDiv').unmask("waiting ...");
        });
    });

    $('#addDetail').click(function () {
        $('.errorAlert').hide();
        $('.successAlert').hide();
        $('#addDetailModal').modal('show');
        
        var headerId = $('#addDetail').val()
        var url = getDomainUrl() + '/MasterDetail/?MasterId=' + headerId + '&handler=AddPartial';
        
        $('#addDetailBody').mask("waiting ...");
        $('#addDetailBody').load(url, function (response, status, xhr) {
            $('#addDetailBody').unmask("waiting ...");
        });
    });

    $('#addDetailForm').submit(function (e) {
        e.preventDefault();
        $('#createDetail').prop('disabled', true);
        $.post(this.action, $(this).serialize(), function (response) {
            if (!response.isSuccess) {
                $('.successAlert').hide();
                $('.errorMessage').text(response.errorText);
                $('.errorAlert').show();
                $('#createDetail').prop('disabled', false);
            }
            else {
                $('#DetailId').val(response.data);
                $('.errorAlert').hide();
                $('.successMessage').text('Detail was successfully created.');
                $('.successAlert').show();

                setTimeout(function () {
                    var url = getDomainUrl() + '/MasterDetail/?MasterId=' + response.data;
                    $('#addDetailModal').modal('hide');
                    window.location.replace(url);

                }, 2000);
            }
        }, 'json');
    });

    $('.editItemLink').click(function (event) {
        event.preventDefault();
        $('.errorAlert').hide();
        $('.successAlert').hide();
        $('#editDetailModal').modal('show');
        var url = getDomainUrl() + $(this).attr("href");

        $('#editDetailBody').mask("waiting ...");
        $('#editDetailBody').load(url, function (response, status, xhr) {
            $('#editDetailBody').unmask("waiting ...");
        });
    });

    $('#editDetailForm').submit(function (e) {
        e.preventDefault();
        $('#updateDetail').prop('disabled', true);
        $.post(this.action, $(this).serialize(), function (response) {
            if (!response.isSuccess) {
                $('.successAlert').hide();
                $('.errorMessage').text(response.errorText);
                $('.errorAlert').show();
                $('#updateDetail').prop('disabled', false);
            }
            else {

                $('.errorAlert').hide();
                $('.successMessage').text('Detail was successfully updated.');
                $('.successAlert').show();

                setTimeout(function () {
                    var url = getDomainUrl() + '/MasterDetail/?MasterId=' +response.data;
                    $('#editDetailModal').modal('hide');
                    window.location.replace(url);

                }, 2000);
            }
        }, 'json');
    });

    $('.close').click(function () {
        clearForm();
        $('.modal').modal('hide');
    });

    function getDomainUrl() {
        return document.location.origin;
    }

    function clearForm() {
        $('form').each(function () { this.reset() });
    }
});
  